// Predidly Bot - V6 Limpo
// Foco: Apenas corrigir checkouts e adicionar casas de apostas (sem quebrar o site)

// LINKS RATIXPAY
const LINK_100 = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';
const LINK_269 = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';

// Novas casas de apostas com emojis corretos
const NEW_HOUSES = [
    { emoji: '🎯', name: 'Placard' },
    { emoji: '🎱', name: '888bet' },
    { emoji: '🐘', name: 'Elephante Bet' }
];

// CSS Performance (remove blur para velocidade)
const style = document.createElement('style');
style.textContent = `
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    .animate-pulse, .animate-spin { animation: none !important; }
`;
document.head.appendChild(style);

// ========== FUNÇÃO: Injetar casas de apostas ==========
function injectHouses() {
    // Procura pelo container da lista de casas de apostas
    // Identifica pelo último item existente (Sportingbet)
    const allDivs = document.querySelectorAll('div');
    let sportingbetItem = null;

    for (let div of allDivs) {
        const text = div.innerText.trim();
        // Procura exatamente "Sportingbet" com emoji
        if (text === 'Sportingbet' || text === '🏆 Sportingbet' || text.endsWith('Sportingbet')) {
            // Verifica se é um item de lista (não todo o container)
            if (div.innerText.length < 30) {
                sportingbetItem = div;
                break;
            }
        }
    }

    if (!sportingbetItem) return;

    // Pega o container pai (lista)
    const container = sportingbetItem.parentElement;
    if (!container || container.hasAttribute('data-houses-v6')) return;
    container.setAttribute('data-houses-v6', 'true');

    // Para cada nova casa, clona o item Sportingbet e modifica
    NEW_HOUSES.forEach(house => {
        const newItem = sportingbetItem.cloneNode(true);

        // Encontra todos os elementos de texto dentro do item
        const walker = document.createTreeWalker(newItem, NodeFilter.SHOW_TEXT, null, false);
        let textNode;

        while (textNode = walker.nextNode()) {
            const text = textNode.textContent.trim();
            // Substitui "Sportingbet" pelo nome da nova casa
            if (text === 'Sportingbet') {
                textNode.textContent = house.name;
            }
            // Substitui emoji existente pelo novo
            if (text === '🏆' || text.length === 2) {
                textNode.textContent = house.emoji;
            }
        }

        // Remove qualquer estado de seleção
        newItem.classList.remove('bg-primary', 'bg-accent', 'data-highlighted');
        newItem.removeAttribute('data-highlighted');
        newItem.removeAttribute('data-state');
        newItem.removeAttribute('aria-selected');

        // Adiciona ao container
        container.appendChild(newItem);
    });

    console.log("✅ Casas de apostas adicionadas com alinhamento correto");
}

// ========== FUNÇÃO: Corrigir botões de checkout ==========
function fixCheckoutButtons() {
    document.querySelectorAll('button, a').forEach(btn => {
        if (btn.hasAttribute('data-v6-fixed')) return;

        const txt = btn.innerText.toLowerCase();

        // Detecta botões de ação de checkout
        if (txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir')) {
            btn.setAttribute('data-v6-fixed', 'true');

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Decide qual link usar
                let url = LINK_100; // Padrão 100 MZN
                if (txt.includes('pro') || txt.includes('269') || document.body.innerText.includes('269 MZN')) {
                    url = LINK_269;
                }

                console.log("✅ Redirecionando para RatixPay:", url);
                window.location.href = url;
                return false;
            };

            console.log("🔧 Botão de checkout corrigido");
        }
    });
}

// ========== LOOP PRINCIPAL (leve - 1x por segundo) ==========
function mainLoop() {
    fixCheckoutButtons();
    injectHouses();
}

// Executa
setInterval(mainLoop, 1000);
mainLoop();

// Também executa quando a página terminar de carregar
window.addEventListener('load', mainLoop);
