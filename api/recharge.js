// ============================================
// API - Recarregar saldo (após pagamento confirmado)
// ============================================
// URL: https://predidly-bot.vercel.app/api/recharge

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'data', 'activations.json');

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
        const { phone, amount, transaction_id } = req.body;

        if (!phone || !amount) {
            return res.status(400).json({ error: 'Phone and amount are required' });
        }

        // Normalizar telefone
        const normalizedPhone = phone.replace(/[\s\+\-]/g, '');

        // Buscar e atualizar ativação
        const db = readDB();
        const activation = db.activations.find(a => a.phone === normalizedPhone);

        if (!activation) {
            return res.status(404).json({
                error: 'Conta não encontrada',
                message: 'Este número não tem uma conta ativada'
            });
        }

        // Verificar transação duplicada
        if (transaction_id && activation.transactions.includes(transaction_id)) {
            return res.status(200).json({
                success: false,
                message: 'Esta recarga já foi processada'
            });
        }

        // Adicionar saldo
        const previousBalance = activation.balance;
        activation.balance += parseFloat(amount);
        activation.updated_at = new Date().toISOString();

        if (transaction_id) {
            activation.transactions.push(transaction_id);
        }

        // Salvar
        saveDB(db);

        return res.status(200).json({
            success: true,
            message: 'Recarga processada com sucesso',
            previous_balance: previousBalance,
            added: parseFloat(amount),
            new_balance: activation.balance
        });

    } catch (error) {
        console.error('Erro ao processar recarga:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
