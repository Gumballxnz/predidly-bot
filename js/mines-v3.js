// Predidly Bot - V9 (Menos Invasivo)
// Só intercepta checkouts específicos, não interfere com o resto do site

// LINKS RATIXPAY
const LINK_100 = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';
const LINK_269 = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';

// Novas casas de apostas
const NEW_HOUSES = [
    { emoji: '🎯', name: 'Placard' },
    { emoji: '🎱', name: '888bet' },
    { emoji: '🐘', name: 'Elephante Bet' }
];

// CSS Performance (mínimo)
const style = document.createElement('style');
style.textContent = `
    .animate-pulse { animation: none !important; }
`;
document.head.appendChild(style);

// ========== FUNÇÃO: Injetar casas de apostas ==========
function injectHouses() {
    const options = document.querySelectorAll('[role="option"]');
    if (options.length === 0) return;

    const container = options[0].parentElement;
    if (!container || container.hasAttribute('data-v9')) return;
    if (container.innerText.includes('Placard')) return;

    const lastItem = options[options.length - 1];
    container.setAttribute('data-v9', '1');

    NEW_HOUSES.forEach(house => {
        const newItem = lastItem.cloneNode(true);

        // Substitui textos
        const spans = newItem.querySelectorAll('span');
        spans.forEach(span => {
            const txt = span.innerText.trim();
            // Se for emoji (1-2 chars), substitui
            if (txt.length <= 2 && txt.length > 0) {
                span.innerText = house.emoji;
            }
            // Se for nome de casa, substitui
            if (txt.length > 3 && txt.length < 20) {
                span.innerText = house.name;
            }
        });

        // Remove estados
        newItem.removeAttribute('data-highlighted');
        newItem.removeAttribute('data-state');
        newItem.removeAttribute('aria-selected');

        // Remove checkmark se tiver
        const svg = newItem.querySelector('svg');
        if (svg) svg.style.display = 'none';

        container.appendChild(newItem);
    });
}

// ========== FUNÇÃO: Corrigir APENAS botões de checkout ==========
// Mais específico para não quebrar outros botões
function fixCheckoutButtons() {
    // Procura especificamente por botões em modais/dialogs de pagamento
    const dialogs = document.querySelectorAll('[role="dialog"], .fixed, [data-state="open"]');

    dialogs.forEach(dialog => {
        const buttons = dialog.querySelectorAll('button');

        buttons.forEach(btn => {
            if (btn.hasAttribute('data-v9')) return;

            const txt = btn.innerText.toLowerCase();

            // Só intercepta se tiver EXATAMENTE essas palavras-chave de checkout
            const isCheckout =
                txt.includes('continuar para ativação') ||
                txt.includes('pagar agora') ||
                txt.includes('finalizar compra') ||
                txt.includes('confirmar pagamento');

            if (isCheckout) {
                btn.setAttribute('data-v9', '1');

                // Adiciona evento sem remover os existentes
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let url = LINK_100;
                    if (txt.includes('pro') || txt.includes('269')) url = LINK_269;

                    window.location.href = url;
                }, true); // capture phase
            }
        });
    });
}

// ========== LOOP PRINCIPAL (menos frequente) ==========
function mainLoop() {
    fixCheckoutButtons();
    injectHouses();
}

// Executa a cada 1 segundo (menos invasivo)
setInterval(mainLoop, 1000);

// Executa no load
window.addEventListener('load', () => setTimeout(mainLoop, 500));
