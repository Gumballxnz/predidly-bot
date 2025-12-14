// Predidly Bot - V7
// Corrigido: Nomes das casas de apostas

// LINKS RATIXPAY
const LINK_100 = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';
const LINK_269 = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';

// Novas casas de apostas
const NEW_HOUSES = [
    { emoji: '🎯', name: 'Placard' },
    { emoji: '🎱', name: '888bet' },
    { emoji: '🐘', name: 'Elephante Bet' }
];

// CSS Performance
const style = document.createElement('style');
style.textContent = `
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    .animate-pulse, .animate-spin { animation: none !important; }
`;
document.head.appendChild(style);

// ========== FUNÇÃO: Injetar casas de apostas ==========
function injectHouses() {
    // Procura pelo item "Sportingbet" na lista
    const allDivs = document.querySelectorAll('div, span');
    let sportingbetItem = null;

    for (let el of allDivs) {
        if (el.innerText === 'Sportingbet' && el.innerText.length < 20) {
            // Sobe até o elemento pai que representa o item completo da lista
            sportingbetItem = el.closest('[role="option"]') || el.closest('[data-radix-collection-item]') || el.parentElement.parentElement;
            break;
        }
    }

    if (!sportingbetItem) return;

    const container = sportingbetItem.parentElement;
    if (!container || container.hasAttribute('data-houses-v7')) return;
    container.setAttribute('data-houses-v7', 'true');

    NEW_HOUSES.forEach(house => {
        const newItem = sportingbetItem.cloneNode(true);

        // Substitui o texto "Sportingbet" pelo nome da nova casa em TODO o HTML interno
        newItem.innerHTML = newItem.innerHTML
            .replace(/Sportingbet/gi, house.name)
            .replace(/🏆/g, house.emoji);

        // Remove estados
        newItem.removeAttribute('data-highlighted');
        newItem.removeAttribute('data-state');
        newItem.removeAttribute('aria-selected');

        container.appendChild(newItem);
    });

    console.log("✅ Casas adicionadas: Placard, 888bet, Elephante Bet");
}

// ========== FUNÇÃO: Corrigir botões de checkout ==========
function fixCheckoutButtons() {
    document.querySelectorAll('button, a').forEach(btn => {
        if (btn.hasAttribute('data-v7-fixed')) return;

        const txt = btn.innerText.toLowerCase();

        if (txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir')) {
            btn.setAttribute('data-v7-fixed', 'true');

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                let url = LINK_100;
                if (txt.includes('pro') || txt.includes('269')) {
                    url = LINK_269;
                }

                console.log("✅ Redirecionando para RatixPay:", url);
                window.location.href = url;
                return false;
            };
        }
    });
}

// ========== LOOP PRINCIPAL ==========
function mainLoop() {
    fixCheckoutButtons();
    injectHouses();
}

setInterval(mainLoop, 1000);
mainLoop();
window.addEventListener('load', mainLoop);
