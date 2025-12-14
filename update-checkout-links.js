// ============================================
// SCRIPT PARA ATUALIZAR LINKS DE CHECKOUT
// ============================================
// Execute este script quando tiver os links do RatixPay

const fs = require('fs');
const path = require('path');

// ⚠️ SUBSTITUA ESTES LINKS PELOS SEUS LINKS DO RATIXPAY
const LINK_ATIVACAO_BASICA = 'https://www.ratixpay.site/checkout/SEU_PRODUTO_BASICO';
const LINK_PRO = 'https://www.ratixpay.site/checkout/SEU_PRODUTO_PRO';

// Links antigos
const LINK_ANTIGO_BASICO = 'https://novatrip.infinityfreeapp.com/produto/predicfly-active/';
const LINK_ANTIGO_PRO = 'https://novatrip.infinityfreeapp.com/produto/predictafly-pro/';

const jsFile = path.join(__dirname, 'js', 'index-Dowo4TYh.js');

console.log('📦 Atualizando links de checkout...\n');

// Ler arquivo
let content = fs.readFileSync(jsFile, 'utf8');

// Substituir links
content = content.replace(new RegExp(LINK_ANTIGO_BASICO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), LINK_ATIVACAO_BASICA);
content = content.replace(new RegExp(LINK_ANTIGO_PRO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), LINK_PRO);

// Salvar arquivo
fs.writeFileSync(jsFile, content);

console.log('✅ Links atualizados com sucesso!');
console.log('');
console.log('Links configurados:');
console.log('  - Ativação Básica:', LINK_ATIVACAO_BASICA);
console.log('  - PRO:', LINK_PRO);
console.log('');
console.log('📌 Lembre-se de fazer deploy no Vercel após essa alteração!');
