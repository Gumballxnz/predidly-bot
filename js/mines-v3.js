// Predidly Bot - V4 Final
// Corrigido: Sem duplicação de botões + Links corretos

// LINKS RATIXPAY - CONFIRMAÇÃO FINAL
// 100 MZN (Básico/Ativação) = L45CA98W7
// 269 MZN (PRO) = FEDMP47IV
const LINK_100 = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';
const LINK_269 = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';

// CSS de Performance (Mantém blur em áreas bloqueadas)
const style = document.createElement('style');
style.textContent = `
    /* Apenas desativa animações pesadas, MAS MANTÉM o blur */
    .animate-pulse, .animate-spin { animation: none !important; }
`;
document.head.appendChild(style);

// Painel Mines
const MINES_PANEL = `
<div id="mines-panel-v4" style="background:#111; padding:15px; border-radius:10px; border:1px solid #333; color:#fff;">
    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
        <h3 style="margin:0; font-size:16px;">Configurar Estratégia</h3>
        <span style="color:#4ade80; font-size:10px; border:1px solid #4ade80; padding:2px 5px; border-radius:4px;">ATIVO</span>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
        <div>
            <label style="font-size:10px; color:#888;">Minas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                <button id="v4-dec-mines" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">-</button>
                <span id="v4-mines" style="font-weight:bold;">3</span>
                <button id="v4-inc-mines" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">+</button>
            </div>
        </div>
        <div>
            <label style="font-size:10px; color:#888;">Tentativas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                <button id="v4-dec-att" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">-</button>
                <span id="v4-att" style="font-weight:bold;">3</span>
                <button id="v4-inc-att" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">+</button>
            </div>
        </div>
    </div>

    <button id="v4-generate" style="width:100%; background:#7c3aed; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer;">
        GERAR SINAL
    </button>

    <div id="v4-result" style="display:none; margin-top:15px; background:#000; padding:10px; border-radius:5px;">
        <div id="v4-grid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:5px; width:150px; margin:0 auto;"></div>
        <div style="text-align:center; font-size:10px; color:#666; margin-top:5px;">ID: <span id="v4-hash"></span></div>
    </div>
</div>
`;

// Funções do Painel
function setupMinesPanel() {
    let mines = 3, att = 3;

    document.getElementById('v4-inc-mines')?.addEventListener('click', () => {
        if (mines < 24) document.getElementById('v4-mines').innerText = ++mines;
    });
    document.getElementById('v4-dec-mines')?.addEventListener('click', () => {
        if (mines > 2) document.getElementById('v4-mines').innerText = --mines;
    });
    document.getElementById('v4-inc-att')?.addEventListener('click', () => {
        if (att < 10) document.getElementById('v4-att').innerText = ++att;
    });
    document.getElementById('v4-dec-att')?.addEventListener('click', () => {
        if (att > 1) document.getElementById('v4-att').innerText = --att;
    });

    document.getElementById('v4-generate')?.addEventListener('click', () => {
        const btn = document.getElementById('v4-generate');
        const res = document.getElementById('v4-result');
        const grid = document.getElementById('v4-grid');

        btn.disabled = true;
        btn.innerText = "Analisando...";
        res.style.display = 'block';
        grid.innerHTML = '';

        for (let i = 0; i < 25; i++) {
            const d = document.createElement('div');
            d.style.cssText = 'background:#222; padding-top:100%; border-radius:2px;';
            grid.appendChild(d);
        }

        setTimeout(() => {
            const stars = new Set();
            while (stars.size < 3) stars.add(Math.floor(Math.random() * 25));

            stars.forEach(s => {
                const cell = grid.children[s];
                cell.style.background = '#fbbf24';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.padding = '0';
                cell.innerText = '★';
            });

            document.getElementById('v4-hash').innerText = Math.random().toString(36).substr(2, 8).toUpperCase();
            btn.disabled = false;
            btn.innerText = "GERAR SINAL";
        }, 1200);
    });
}

// Lógica Principal (Roda 1x por segundo)
function mainLoop() {
    // 1. Injetar Painel Mines
    if (!document.getElementById('mines-panel-v4')) {
        const divs = document.querySelectorAll('div');
        for (let d of divs) {
            if (d.innerText.length < 100 && d.innerText.toLowerCase().includes('em breve')) {
                const container = d.closest('.bg-card') || d.parentElement;
                if (container) {
                    container.innerHTML = MINES_PANEL;
                    setupMinesPanel();
                    break;
                }
            }
        }
    }

    // 2. Corrigir Botões de Checkout (SEM DUPLICAR)
    const buttons = document.querySelectorAll('button, a');

    buttons.forEach(btn => {
        // IGNORA se já foi processado
        if (btn.hasAttribute('data-v4-done')) return;

        // IGNORA botões do nosso painel
        if (btn.id && btn.id.startsWith('v4-')) return;

        const txt = btn.innerText.toLowerCase();

        // Detecta botões de checkout final
        if (txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir')) {

            // Marca como processado ANTES de fazer qualquer coisa
            btn.setAttribute('data-v4-done', 'true');

            // Substitui o evento onclick
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Decide link baseado no contexto
                let url = LINK_100; // Padrão: Ativação básica 100 MZN

                // Se mencionar PRO ou 269, usa o link PRO
                if (txt.includes('pro') || txt.includes('269') || document.body.innerText.includes('269 MZN')) {
                    url = LINK_269;
                }

                console.log("✅ Redirecionando para:", url);
                window.location.href = url;
                return false;
            };

            console.log("🔧 Botão corrigido:", txt.substring(0, 30));
        }
    });
}

// Executa a cada 1 segundo (leve)
setInterval(mainLoop, 1000);

// Executa imediatamente também
mainLoop();
