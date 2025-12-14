// ============================================
// API - Verificar status de ativação
// ============================================
// URL: https://predidly-bot.vercel.app/api/check-activation

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

export default async function handler(req, res) {
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { phone } = req.query;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Normalizar telefone
        const normalizedPhone = phone.replace(/[\s\+\-]/g, '');

        // Buscar ativação
        const db = readDB();
        const activation = db.activations.find(a => a.phone === normalizedPhone);

        if (!activation) {
            return res.status(200).json({
                found: false,
                is_active: false,
                message: 'Nenhuma ativação encontrada para este número'
            });
        }

        return res.status(200).json({
            found: true,
            is_active: activation.is_active,
            type: activation.type,
            balance: activation.balance,
            name: activation.name,
            created_at: activation.created_at
        });

    } catch (error) {
        console.error('Erro ao verificar ativação:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
