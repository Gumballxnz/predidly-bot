const crypto = require('crypto');

// Configurações do Facebook
const PIXEL_ID = "2005862116860795";
const ACCESS_TOKEN = "EAAMAmvHM3vQBQAV7Cb9y813ovS0XFOyu9Prc9iArlErJw7XFIXU6PWPQNDAbzSZAIjMZAyCHaynK8E8Eb0SO8vlZBIAUrAa3jpmToXgy4APMbSQ5o2G07mCHwoP3Q8sRNX77LPq9Wfeyu6fj67X2XZBGS388QtZC6VlXmq1vivstvhZCL9vfpCZBepSneutywZDZD";

// Função para hash SHA256 (Facebook exige dados hasheados)
function hashData(data) {
    return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { event_name, event_source_url, user_data = {}, custom_data = {} } = req.body;

        // Preparar dados do usuário com hash
        const hashedUserData = {};

        if (user_data.email) {
            hashedUserData.em = [hashData(user_data.email)];
        }
        if (user_data.phone) {
            hashedUserData.ph = [hashData(user_data.phone)];
        }
        if (user_data.client_ip_address) {
            hashedUserData.client_ip_address = user_data.client_ip_address;
        }
        if (user_data.client_user_agent) {
            hashedUserData.client_user_agent = user_data.client_user_agent;
        }
        if (user_data.fbc) {
            hashedUserData.fbc = user_data.fbc;
        }
        if (user_data.fbp) {
            hashedUserData.fbp = user_data.fbp;
        }

        // Pegar IP do cliente
        const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress;
        if (clientIP && !hashedUserData.client_ip_address) {
            hashedUserData.client_ip_address = clientIP.split(',')[0].trim();
        }

        // Construir payload para Facebook
        const payload = {
            data: [{
                event_name: event_name,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: event_source_url || "https://predidly-bot.vercel.app",
                user_data: hashedUserData,
                custom_data: custom_data
            }]
        };

        // Enviar para Facebook Conversions API
        const fbResponse = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        const fbResult = await fbResponse.json();

        console.log('Facebook CAPI Response:', fbResult);

        res.status(200).json({
            success: true,
            event: event_name,
            facebook_response: fbResult
        });

    } catch (error) {
        console.error('CAPI Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
