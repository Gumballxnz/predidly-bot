// Predidly Bot - V8
// Abordagem diferente: procura qualquer item da lista e adiciona no final

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
    // Procura por qualquer casa conhecida para identificar a estrutura da lista
    const knownHouses = ['1xBet', 'Bet365', 'Betway', 'Paripesa', '22Bet'];
    let referenceItem = null;

    // Procura por elementos [role="option"] que são os itens da lista
    const options = document.querySelectorAll('[role="option"]');

    for (let opt of options) {
        const txt = opt.innerText;
        // Verifica se é uma casa de apostas conhecida
        if (knownHouses.some(h => txt.includes(h))) {
            referenceItem = opt;
            // Não faz break, queremos o último
        }
    }

    if (!referenceItem) {
        // Tenta outra abordagem: procura por data-radix-collection-item
        const radixItems = document.querySelectorAll('[data-radix-collection-item]');
        if (radixItems.length > 0) {
            referenceItem = radixItems[radixItems.length - 1];
        }
    }

    if (!referenceItem) return;

    const container = referenceItem.parentElement;
    if (!container || container.hasAttribute('data-v8-done')) return;

    // Verifica se já tem Placard (evita duplicação)
    if (container.innerText.includes('Placard')) return;

    container.setAttribute('data-v8-done', 'true');

    NEW_HOUSES.forEach(house => {
        const newItem = referenceItem.cloneNode(true);

        // Pega o HTML e substitui o nome e emoji
        let html = newItem.innerHTML;

        // Substitui qualquer nome de casa conhecida pelo novo nome
        knownHouses.forEach(h => {
            html = html.replace(new RegExp(h, 'gi'), house.name);
        });
        html = html.replace(/Sportingbet/gi, house.name);

        // Substitui emojis conhecidos
        html = html.replace(/🏆|⚡|👑|🔥|💰|🎰/g, house.emoji);

        newItem.innerHTML = html;

        // Remove estados de seleção
        newItem.removeAttribute('data-highlighted');
        newItem.removeAttribute('data-state');
        newItem.removeAttribute('aria-selected');
        newItem.classList.remove('bg-primary', 'bg-accent');

        // Garante que o check mark não aparece
        const checkSvg = newItem.querySelector('svg');
        if (checkSvg) checkSvg.remove();

        container.appendChild(newItem);
    });

    console.log("✅ V8: Casas adicionadas com sucesso!");
}

// ========== FUNÇÃO: Corrigir botões de checkout ==========
function fixCheckoutButtons() {
    document.querySelectorAll('button, a').forEach(btn => {
        if (btn.hasAttribute('data-v8')) return;

        const txt = btn.innerText.toLowerCase();

        if (txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir')) {
            btn.setAttribute('data-v8', '1');

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                let url = LINK_100;
                if (txt.includes('pro') || txt.includes('269')) url = LINK_269;

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

setInterval(mainLoop, 500); // Mais frequente para pegar o dropdown
mainLoop();
window.addEventListener('load', mainLoop);
