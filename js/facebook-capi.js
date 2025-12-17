/**
 * Facebook Conversions API Helper
 * Este script envia eventos para o Facebook via Supabase Edge Function
 */

const SUPABASE_URL = 'https://ziykvuzsoowplncwedxf.supabase.co';
const CAPI_FUNCTION = `${SUPABASE_URL}/functions/v1/facebook-capi`;

/**
 * Obtém cookies do Facebook (fbc, fbp) para melhor tracking
 */
function getFacebookCookies() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});

    return {
        fbc: cookies['_fbc'] || null,
        fbp: cookies['_fbp'] || null
    };
}

/**
 * Envia evento para Facebook Conversions API via Supabase
 * @param {string} eventName - Nome do evento (PageView, ViewContent, InitiateCheckout, AddToCart, Purchase)
 * @param {object} customData - Dados customizados (value, currency, content_name, etc)
 * @param {object} userData - Dados do usuário (email, phone - serão hasheados no servidor)
 */
async function sendFacebookEvent(eventName, customData = {}, userData = {}) {
    try {
        const fbCookies = getFacebookCookies();

        const payload = {
            event_name: eventName,
            event_source_url: window.location.href,
            user_data: {
                ...userData,
                fbc: fbCookies.fbc,
                fbp: fbCookies.fbp,
                client_user_agent: navigator.userAgent
            },
            custom_data: customData
        };

        const response = await fetch(CAPI_FUNCTION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(`✅ CAPI Event [${eventName}]:`, result);
        return result;

    } catch (error) {
        console.error(`❌ CAPI Event [${eventName}] Error:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Eventos pré-configurados
 */
const FacebookCAPI = {
    // Quando a página carrega
    pageView: () => sendFacebookEvent('PageView'),

    // Quando vê o conteúdo
    viewContent: (contentName) => sendFacebookEvent('ViewContent', {
        content_name: contentName || 'Predidly Bot'
    }),

    // Quando clica no botão de começar
    initiateCheckout: () => sendFacebookEvent('InitiateCheckout', {
        content_name: 'Predidly Bot Activation',
        currency: 'MZN',
        value: 100
    }),

    // Quando clica no checkout (RatixPay)
    addToCart: (value = 100, productName = 'Licença Predidly Bot') => sendFacebookEvent('AddToCart', {
        content_name: productName,
        currency: 'MZN',
        value: value
    }),

    // Quando completa a compra (chamar após confirmação de pagamento)
    purchase: (value, email = null, phone = null) => sendFacebookEvent('Purchase', {
        content_name: 'Licença Predidly Bot',
        currency: 'MZN',
        value: value
    }, {
        email: email,
        phone: phone
    })
};

// Exportar para uso global
window.FacebookCAPI = FacebookCAPI;

console.log('📊 Facebook CAPI Helper carregado. Use: FacebookCAPI.pageView(), FacebookCAPI.addToCart(), etc.');
