// Predidly Bot - Mines Injector & Performance Optimizer
// Versão Otimizada: Remove delays e observers pesados para rodar liso em celulares fracos.

// LINKS DE CHECKOUT ATUALIZADOS - CONFIRMADOS PELO USUÁRIO (INVERTIDOS)
// Basic = 100 MT = FEDMP47IV (Botão Recarregar/Ativar)
// Pro = 269 MT = L45CA98W7 (Especial)
const CHECKOUT_BASIC = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';
const CHECKOUT_PRO = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';

// HTML do Painel Mines (Otimizado - menos classes pesadas)
const MINES_HTML = `
<div id="mines-control-panel" class="w-full flex flex-col gap-3 p-4 bg-[#0f172a] rounded-lg border border-gray-800">
    <!-- Header Simples -->
    <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-white">Configurar Estratégia</h3>
        <span class="px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-[10px] font-bold border border-green-800">NO AR</span>
    </div>

    <!-- Controles -->
    <div class="grid grid-cols-2 gap-3">
        <!-- Minas -->
        <div>
            <label class="block text-xs text-gray-400 mb-1">Minas</label>
            <div class="flex items-center bg-gray-800 rounded border border-gray-700">
                <button id="dec-mines" class="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 font-bold">-</button>
                <span id="mines-count" class="flex-1 text-center font-bold text-white">3</span>
                <button id="inc-mines" class="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 font-bold">+</button>
            </div>
        </div>
        <!-- Tentativas -->
        <div>
            <label class="block text-xs text-gray-400 mb-1">Tentativas</label>
            <div class="flex items-center bg-gray-800 rounded border border-gray-700">
                <button id="dec-attempts" class="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 font-bold">-</button>
                <span id="attempts-count" class="flex-1 text-center font-bold text-white">3</span>
                <button id="inc-attempts" class="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 font-bold">+</button>
            </div>
        </div>
    </div>

    <!-- Modos -->
    <div class="grid grid-cols-3 gap-2 my-1">
        <button class="strat-btn active bg-indigo-600 text-white rounded text-xs py-2 font-bold transition-colors">Conservador</button>
        <button class="strat-btn bg-gray-800 text-gray-400 hover:text-white rounded text-xs py-2 font-bold transition-colors">Moderado</button>
        <button class="strat-btn bg-gray-800 text-gray-400 hover:text-white rounded text-xs py-2 font-bold transition-colors">Agressivo</button>
    </div>

    <!-- Botão Gerar -->
    <button id="generate-signals" class="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        GERAR SINAL
    </button>

    <!-- Display -->
    <div id="signal-display" class="hidden mt-3 p-3 bg-black/50 rounded border border-gray-800">
        <div class="grid grid-cols-5 gap-1.5 aspect-square max-w-[180px] mx-auto" id="mines-grid"></div>
        <div class="text-center mt-2 text-[10px] font-mono text-gray-500" id="signal-hash">...</div>
    </div>
</div>

<style>
  /* CSS Otimizado - Sem animações pesadas */
  .mine-cell { background-color: #1e293b; border-radius: 2px; }
  .mine-cell.star { background-color: #fbbf24; transform: scale(0.95); box-shadow: 0 0 5px #f59e0b; }
</style>
`;

// =========================================================================
// INTERCEPTADOR DE CLIQUES GLOBAL (A Mágica da Velocidade)
// =========================================================================
// Isso captura o clique ANTES de qualquer script do site original processá-lo.
// Garante redirecionamento INSTANTÂNEO e zero processamento desnecessário.

window.addEventListener('click', function (e) {
    // Procura se o clique foi num botão ou link (ou filho de um)
    let target = e.target.closest('button, a');

    if (!target) return;

    const text = (target.innerText || '').toLowerCase();

    // Lista de palavras-chave para checkout FINAL
    const checkoutKeywords = ['pagar', 'assinar', 'comprar', 'prosseguir', 'checkout', 'finalizar'];
    const isCheckoutBtn = checkoutKeywords.some(w => text.includes(w)) && !text.includes('fechar') && !text.includes('cancelar');

    // Se for link direto (<a>) configurado errado
    const isLink = target.tagName === 'A';
    const isOldLink = target.href && (target.href.includes('infinityfree') || target.href.includes('produto='));

    // Verifica se estamos num modal ou diálogo (popups)
    const inDialog = target.closest('[role="dialog"], .fixed, .modal');

    // CONDIÇÃO PARA INTERCEPTAR O CLICK (Checkout Final)
    if ((isCheckoutBtn && inDialog) || isOldLink) {
        // Verifica se é o botão "Gerar Sinal" (não queremos interceptar esse)
        if (target.id === 'generate-signals' || target.closest('#mines-control-panel')) return;

        console.log("🚀 Interceptação de Checkout Rápido Acionada!");

        // Bloqueia TUDO do site antigo (scripts, timers, delays)
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Decide para onde vai (Basic vs Pro)
        let finalUrl = CHECKOUT_BASIC;
        // Lógica simples: Se diz PRO, vai pro link PRO.
        if (text.includes('pro') || (inDialog && inDialog.innerText.includes('PRO')) || document.body.innerText.includes('Predidly Bot PRO')) {
            // Check extra pra garantir que não estamos mandando Basic pro PRO
            if (!text.includes('100') && !text.includes('basic')) {
                finalUrl = CHECKOUT_PRO;
            }
        }

        // Redireciona NA HORA
        console.log("Redirecionando para:", finalUrl);
        window.location.href = finalUrl;
        return false;
    }

}, true); // UseCapture = true é o segredo aqui

// =========================================================================
// INJETOR DO PAINEL MINES (Versão Leve)
// =========================================================================

let minesState = { mines: 3, strategy: 'Conservador' };

function injectMines() {
    // Se já existe, aborta (economiza CPU)
    if (document.getElementById('mines-control-panel')) return;

    // Busca heurística leve - procura apenas divs visíveis com texto curto
    const possibleDivs = document.querySelectorAll('div');
    for (let i = 0; i < possibleDivs.length; i++) {
        const t = possibleDivs[i].innerText;
        // Check rápido de string curta "Em breve"
        if (t.length < 50 && (t.includes('Em breve') || t.includes('em breve'))) {
            const container = possibleDivs[i].closest('.bg-card, .rounded-lg') || possibleDivs[i].parentElement;
            if (container) {
                container.innerHTML = MINES_HTML;
                container.style.minHeight = "auto";
                setupMinesEvents();
                console.log("✅ Painel injetado (Modo Leve)");
                return; // Para assim que achar
            }
        }
    }
}

function setupMinesEvents() {
    document.getElementById('inc-mines').onclick = () => { if (minesState.mines < 24) updateMinesDisplay(++minesState.mines) };
    document.getElementById('dec-mines').onclick = () => { if (minesState.mines > 2) updateMinesDisplay(--minesState.mines) };
    document.getElementById('inc-attempts').onclick = () => {
        let v = parseInt(document.getElementById('attempts-count').innerText);
        if (v < 10) document.getElementById('attempts-count').innerText = v + 1;
    };
    document.getElementById('dec-attempts').onclick = () => {
        let v = parseInt(document.getElementById('attempts-count').innerText);
        if (v > 1) document.getElementById('attempts-count').innerText = v - 1;
    };

    const btns = document.querySelectorAll('.strat-btn');
    btns.forEach(b => b.onclick = (e) => {
        btns.forEach(x => { x.classList.remove('active', 'bg-indigo-600', 'text-white'); x.classList.add('bg-gray-800', 'text-gray-400'); });
        e.target.classList.remove('bg-gray-800', 'text-gray-400');
        e.target.classList.add('active', 'bg-indigo-600', 'text-white');
    });

    document.getElementById('generate-signals').onclick = runPrediction;
}

function updateMinesDisplay(val) { document.getElementById('mines-count').innerText = val; }

function runPrediction() {
    const grid = document.getElementById('mines-grid');
    const display = document.getElementById('signal-display');
    const btn = document.getElementById('generate-signals');

    display.classList.remove('hidden');
    grid.innerHTML = '';

    // Cria grid de forma eficiente
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 25; i++) {
        const div = document.createElement('div');
        div.className = 'mine-cell w-full h-full';
        fragment.appendChild(div);
    }
    grid.appendChild(fragment);

    btn.disabled = true;
    btn.innerText = "Analisando...";

    // Delay reduzido para parecer mais ágil
    setTimeout(() => {
        const stars = new Set();
        while (stars.size < 3) stars.add(Math.floor(Math.random() * 25));

        const cells = grid.children;
        stars.forEach(idx => {
            cells[idx].innerHTML = "⭐";
            cells[idx].classList.add('star');
        });

        document.getElementById('signal-hash').innerText = `ID: ${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        btn.disabled = false;
        btn.innerText = "GERAR NOVO SINAL";
    }, 1500);
}

// =========================================================================
// LOOP LEVE (Substitui MutationObserver pesado)
// =========================================================================
// Roda apenas a cada 1 segundo. Custo de CPU quase zero.
setInterval(injectMines, 1000);

// Executa uma vez no load
injectMines();
