// ============================================
// WEBHOOK API - Recebe notificações de pagamento do RatixPay
// ============================================
// Deploy no Vercel: Este arquivo será automaticamente uma API route
// URL: https://predidly-bot.vercel.app/api/webhook

const fs = require('fs');
const path = require('path');

// Arquivo JSON como banco de dados simples (para produção use Vercel KV ou Postgres)
const DB_FILE = path.join(process.cwd(), 'data', 'activations.json');

// Função para ler o banco de dados
function readDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao ler DB:', error);
    }
    return { activations: [], transactions: [] };
}

// Função para salvar no banco de dados
function saveDB(data) {
    try {
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar DB:', error);
        return false;
    }
}

// Handler do webhook
export default async function handler(req, res) {
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body;

        console.log('📥 Webhook recebido:', JSON.stringify(payload, null, 2));

        // Extrair dados do pagamento (ajustar conforme estrutura do RatixPay)
        const {
            transaction_id,
            product_id,       // 'predidly_basic' ou 'predidly_pro'
            customer_phone,   // Número de telefone do cliente
            customer_email,
            customer_name,
            amount,
            status,           // 'approved', 'pending', 'failed'
            payment_method,
        } = payload;

        // Verificar se o pagamento foi aprovado
        if (status !== 'approved' && status !== 'paid' && status !== 'completed') {
            console.log('⏳ Pagamento ainda não aprovado:', status);
            return res.status(200).json({ received: true, processed: false, reason: 'payment_pending' });
        }

        // Determinar tipo de ativação e saldo
        let activationType = 'basic';
        let bonusBalance = 200;

        if (product_id === 'predidly_pro' || amount >= 269) {
            activationType = 'pro';
            bonusBalance = 1000;
        }

        // Ler banco de dados
        const db = readDB();

        // Verificar se transação já foi processada
        const existingTransaction = db.transactions.find(t => t.transaction_id === transaction_id);
        if (existingTransaction) {
            console.log('⚠️ Transação já processada:', transaction_id);
            return res.status(200).json({ received: true, processed: false, reason: 'duplicate' });
        }

        // Normalizar telefone (remover espaços, +, etc)
        const normalizedPhone = customer_phone?.replace(/[\s\+\-]/g, '') || '';

        // Verificar se já existe ativação para este telefone
        let existingActivation = db.activations.find(a => a.phone === normalizedPhone);

        if (existingActivation) {
            // Atualizar ativação existente
            existingActivation.balance += bonusBalance;
            existingActivation.type = activationType === 'pro' ? 'pro' : existingActivation.type;
            existingActivation.updated_at = new Date().toISOString();
            existingActivation.transactions.push(transaction_id);
            console.log('🔄 Ativação atualizada:', normalizedPhone);
        } else {
            // Criar nova ativação
            const newActivation = {
                id: `ACT-${Date.now()}`,
                phone: normalizedPhone,
                email: customer_email || '',
                name: customer_name || '',
                type: activationType,
                balance: bonusBalance,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                transactions: [transaction_id]
            };
            db.activations.push(newActivation);
            console.log('✅ Nova ativação criada:', normalizedPhone);
        }

        // Registrar transação
        db.transactions.push({
            transaction_id,
            phone: normalizedPhone,
            product_id,
            amount,
            status,
            payment_method,
            processed_at: new Date().toISOString()
        });

        // Salvar banco de dados
        saveDB(db);

        console.log('✅ Pagamento processado com sucesso!');

        return res.status(200).json({
            success: true,
            message: 'Ativação processada com sucesso',
            activation: {
                phone: normalizedPhone,
                type: activationType,
                balance: bonusBalance
            }
        });

    } catch (error) {
        console.error('❌ Erro no webhook:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
