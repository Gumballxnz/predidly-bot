// Predidly Bot - V5 Final
// Sem duplicação + Links corretos + Casas de apostas extras

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

// Painel Mines
const MINES_PANEL = `
<div id="mines-panel-v5" style="background:#111; padding:15px; border-radius:10px; border:1px solid #333; color:#fff;">
    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
        <h3 style="margin:0; font-size:16px;">Configurar Estratégia</h3>
        <span style="color:#4ade80; font-size:10px; border:1px solid #4ade80; padding:2px 5px; border-radius:4px;">ATIVO</span>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
        <div>
            <label style="font-size:10px; color:#888;">Minas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                <button id="v5-dec-m" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">-</button>
                <span id="v5-m">3</span>
                <button id="v5-inc-m" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">+</button>
            </div>
        </div>
        <div>
            <label style="font-size:10px; color:#888;">Tentativas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                <button id="v5-dec-t" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">-</button>
                <span id="v5-t">3</span>
                <button id="v5-inc-t" style="color:#fff; background:transparent; border:none; font-size:18px; cursor:pointer;">+</button>
            </div>
        </div>
    </div>
    <button id="v5-gen" style="width:100%; background:#7c3aed; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer;">
        GERAR SINAL
    </button>
    <div id="v5-res" style="display:none; margin-top:15px; background:#000; padding:10px; border-radius:5px;">
        <div id="v5-grid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:5px; width:150px; margin:0 auto;"></div>
        <div style="text-align:center; font-size:10px; color:#666; margin-top:5px;">ID: <span id="v5-hash"></span></div>
    </div>
</div>
`;

function setupMines() {
    let m = 3, t = 3;
    document.getElementById('v5-inc-m')?.addEventListener('click', () => { if (m < 24) document.getElementById('v5-m').innerText = ++m; });
    document.getElementById('v5-dec-m')?.addEventListener('click', () => { if (m > 2) document.getElementById('v5-m').innerText = --m; });
    document.getElementById('v5-inc-t')?.addEventListener('click', () => { if (t < 10) document.getElementById('v5-t').innerText = ++t; });
    document.getElementById('v5-dec-t')?.addEventListener('click', () => { if (t > 1) document.getElementById('v5-t').innerText = --t; });

    document.getElementById('v5-gen')?.addEventListener('click', () => {
        const btn = document.getElementById('v5-gen');
        const grid = document.getElementById('v5-grid');
        document.getElementById('v5-res').style.display = 'block';
        btn.disabled = true; btn.innerText = "Analisando...";
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
                grid.children[s].style.background = '#fbbf24';
                grid.children[s].innerText = '★';
                grid.children[s].style.display = 'flex';
                grid.children[s].style.alignItems = 'center';
                grid.children[s].style.justifyContent = 'center';
                grid.children[s].style.padding = '0';
            });
            document.getElementById('v5-hash').innerText = Math.random().toString(36).substr(2, 8).toUpperCase();
            btn.disabled = false; btn.innerText = "GERAR SINAL";
        }, 1200);
    });
}

function injectHouses() {
    // Procura lista de casas (elemento que contém "Sportingbet")
    const items = document.querySelectorAll('div[role="option"], [data-radix-collection-item]');
    let lastItem = null;

    for (let item of items) {
        if (item.innerText.includes('Sportingbet')) {
            lastItem = item;
            break;
        }
    }

    if (!lastItem) return;

    const container = lastItem.parentElement;
    if (!container || container.hasAttribute('data-houses-done')) return;
    container.setAttribute('data-houses-done', 'true');

    NEW_HOUSES.forEach(h => {
        const clone = lastItem.cloneNode(true);
        // Atualizar conteúdo
        const spans = clone.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].innerText = h.emoji;
            spans[1].innerText = h.name;
        } else if (spans.length === 1) {
            spans[0].innerHTML = `${h.emoji} ${h.name}`;
        } else {
            clone.innerHTML = `<span>${h.emoji}</span><span style="margin-left:8px;">${h.name}</span>`;
        }
        clone.removeAttribute('data-state');
        clone.removeAttribute('aria-selected');
        container.appendChild(clone);
    });

    console.log("✅ Casas adicionadas: Placard, 888bet, Elephante Bet");
}

function fixCheckoutButtons() {
    document.querySelectorAll('button, a').forEach(btn => {
        if (btn.hasAttribute('data-v5')) return;
        if (btn.id && btn.id.startsWith('v5-')) return;

        const txt = btn.innerText.toLowerCase();
        if (txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir')) {
            btn.setAttribute('data-v5', '1');
            btn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                let url = LINK_100;
                if (txt.includes('pro') || txt.includes('269')) url = LINK_269;
                window.location.href = url;
                return false;
            };
        }
    });
}

function injectMinesPanel() {
    if (document.getElementById('mines-panel-v5')) return;
    const divs = document.querySelectorAll('div');
    for (let d of divs) {
        if (d.innerText.length < 100 && d.innerText.toLowerCase().includes('em breve')) {
            const c = d.closest('.bg-card') || d.parentElement;
            if (c) { c.innerHTML = MINES_PANEL; setupMines(); break; }
        }
    }
}

function mainLoop() {
    injectMinesPanel();
    fixCheckoutButtons();
    injectHouses();
}

setInterval(mainLoop, 1000);
mainLoop();
