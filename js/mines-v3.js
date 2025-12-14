// Predidly Bot - Ultimate Fix (V3)
// Foco: Performance Extrema + Redirecionamento Implacável

// Links RatixPay
const LINK_BASIC = 'https://www.ratixpay.site/checkout.html?produto=FEDMP47IV';
const LINK_PRO = 'https://www.ratixpay.site/checkout.html?produto=L45CA98W7';

// 1. APLICAÇÃO DE CSS DE PERFORMANCE
// Desativa efeitos pesados que travam celulares
const style = document.createElement('style');
style.textContent = `
    /* Desativa blur e sombras pesadas */
    * { 
        backdrop-filter: none !important; 
        -webkit-backdrop-filter: none !important;
        text-shadow: none !important;
    }
    
    /* Remove animações de fundo/elementos */
    .animate-pulse, .animate-spin, .animate-bounce { animation: none !important; }
    
    /* Força aceleração de hardware onde importa */
    .transform { transform: translateZ(0); }
    
    /* Garante visibilidade e contraste */
    body { background-color: #000 !important; }
`;
document.head.appendChild(style);

// 2. HTML DO PAINEL DE MINES (Simplificado)
const MINES_PANEL = `
<div id="mines-panel-v3" style="background:#111; padding:15px; border-radius:10px; border:1px solid #333; color:#fff;">
    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
        <h3 style="margin:0; font-size:16px;">Configurar Estratégia</h3>
        <span style="color:#4ade80; font-size:10px; border:1px solid #4ade80; padding:2px 5px; border-radius:4px;">ATIVO</span>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
        <div>
            <label style="font-size:10px; color:#888;">Minas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between;">
                <button onclick="updateMines(-1)" style="color:#fff;">-</button>
                <span id="v3-mines">3</span>
                <button onclick="updateMines(1)" style="color:#fff;">+</button>
            </div>
        </div>
        <div>
            <label style="font-size:10px; color:#888;">Tentativas</label>
            <div style="background:#222; padding:5px; border-radius:5px; display:flex; justify-content:space-between;">
                <button style="color:#fff;">-</button>
                <span>3</span>
                <button style="color:#fff;">+</button>
            </div>
        </div>
    </div>

    <button id="v3-generate" onclick="generateV3()" style="width:100%; background:#7c3aed; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; margin-top:5px;">
        GERAR SINAL
    </button>

    <div id="v3-result" style="display:none; margin-top:15px; background:#000; padding:10px; border-radius:5px;">
        <div id="v3-grid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:5px; width:150px; margin:0 auto;"></div>
        <div style="text-align:center; font-size:10px; color:#666; margin-top:5px;">ID: <span id="v3-hash"></span></div>
    </div>
</div>
`;

// Funções globais para o HTML acima funcionar
window.minesVal = 3;
window.updateMines = (n) => {
    window.minesVal += n;
    if (window.minesVal < 2) window.minesVal = 2;
    if (window.minesVal > 24) window.minesVal = 24;
    document.getElementById('v3-mines').innerText = window.minesVal;
};

window.generateV3 = () => {
    const btn = document.getElementById('v3-generate');
    const res = document.getElementById('v3-result');
    const grid = document.getElementById('v3-grid');

    btn.disabled = true;
    btn.innerText = "Analisando...";
    btn.style.opacity = "0.7";

    res.style.display = 'block';
    grid.innerHTML = '';

    // Grid instantâneo
    for (let i = 0; i < 25; i++) {
        const d = document.createElement('div');
        d.style.width = '100%';
        d.style.paddingTop = '100%';
        d.style.background = '#222';
        d.style.borderRadius = '2px';
        grid.appendChild(d);
    }

    // Resultado rápido (1.2s)
    setTimeout(() => {
        const stars = [];
        while (stars.length < 3) {
            let r = Math.floor(Math.random() * 25);
            if (!stars.includes(r)) stars.push(r);
        }

        const cells = grid.children;
        stars.forEach(s => {
            cells[s].style.background = '#fbbf24';
            cells[s].innerText = '★'; // Estrela simples
            cells[s].style.display = 'flex';
            cells[s].style.alignItems = 'center';
            cells[s].style.justifyContent = 'center';
            cells[s].style.height = cells[s].offsetWidth + 'px';
            cells[s].style.padding = '0';
        });

        document.getElementById('v3-hash').innerText = Math.random().toString(36).substr(2, 8).toUpperCase();
        btn.disabled = false;
        btn.innerText = "GERAR SINAL";
        btn.style.opacity = "1";
    }, 1200);
};

// 3. LÓGICA DE INTERCEPTAÇÃO E SUBSTITUIÇÃO DE BOTÕES
function replaceCheckoutButtons() {
    // Procura por botões dentro de modais/popups
    const buttons = document.querySelectorAll('button, a.btn'); // Ajuste selector conforme necessário

    buttons.forEach(btn => {
        // Ignora botões do nosso painel
        if (btn.id && (btn.id.startsWith('v3-') || btn.id.startsWith('dec-') || btn.id.startsWith('inc-'))) return;
        if (btn.getAttribute('data-v3-processed')) return; // Já processado

        const txt = btn.innerText.toLowerCase();

        // Identifica botões alvo: "Continuar", "Pagar", "Assinar", etc
        // EVITA: "Recarregar" (queremos que esse abra o modal)
        if ((txt.includes('continuar') || txt.includes('pagar') || txt.includes('assinar') || txt.includes('prosseguir'))
            && !txt.includes('recarregar') && !txt.includes('cancelar')) {

            console.log("🔥 Substituindo botão lento:", btn);

            // 1. Esconde o original (não remove para não quebrar layout se for flex)
            btn.style.display = 'none';

            // 2. Cria um NOVO botão totalmente limpo
            const newBtn = document.createElement('button');
            newBtn.innerHTML = btn.innerHTML; // Copia visual
            newBtn.className = btn.className; // Copia classes para estilo
            newBtn.style.display = 'flex'; // Restaura display
            newBtn.setAttribute('data-v3-processed', 'true');

            // 3. Lógica de Link Correta
            let url = LINK_BASIC;
            if (txt.includes('pro') || document.body.innerText.includes('Bot PRO')) {
                url = LINK_PRO;
            }

            // 4. Evento Simples e Direto
            newBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("⚡ Redirecionamento V3 para:", url);
                window.location.href = url;
            };

            // 5. Insere logo após o original
            btn.parentNode.insertBefore(newBtn, btn.nextSibling);

            // Tenta remover qualquer listener residual do original apenas por segurança
            // (Embora o display:none já deva impedir cliques nele)
        }
    });

    // Injeção do Painel Mines
    if (!document.getElementById('mines-panel-v3')) {
        const target = Array.from(document.querySelectorAll('div')).find(d => d.innerText.toLowerCase().includes('em breve') && d.innerText.length < 100);
        if (target) {
            const container = target.closest('.bg-card') || target.parentElement;
            if (container) {
                container.innerHTML = MINES_PANEL;
            }
        }
    }
}

// Loop de verificação rápido e leve (200ms)
setInterval(replaceCheckoutButtons, 200);
