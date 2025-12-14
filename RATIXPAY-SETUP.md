# 🔧 GUIA COMPLETO DE CONFIGURAÇÃO - RatixPay + Predidly Bot

## 📋 Informações de Acesso

- **Site:** https://www.ratixpay.site/
- **Email:** fbilionario01@gmail.com
- **Senha:** Roman700

---

## 🎯 PASSO 1: Criar Produto - Ativação Básica (100 MZN)

### No painel do RatixPay:

1. Vá em **"Produtos"** ou **"Criar Produto"**
2. Preencha:

| Campo | Valor |
|-------|-------|
| **Nome do Produto** | Ativação Predidly Bot |
| **Preço** | 100 MZN |
| **Descrição** | Ative sua conta e receba +200 MT de bônus para começar a lucrar! |
| **ID do Produto** (se disponível) | predidly_basic |

3. **IMPORTANTE - URL de Redirecionamento Após Pagamento:**

```
https://predidly-bot.vercel.app/?shared_password=Raffle!2025$X7&order_id={ORDER_ID}
```

> ⚠️ Substitua `{ORDER_ID}` pela variável que o RatixPay usa para o ID da transação (pode ser `{{order_id}}`, `{{transaction_id}}`, ou similar - verifique a documentação do RatixPay)

---

## 🎯 PASSO 2: Criar Produto - PRO (269 MZN)

1. Crie outro produto:

| Campo | Valor |
|-------|-------|
| **Nome do Produto** | Predidly Bot PRO |
| **Preço** | 269 MZN |
| **Descrição** | Acesso PRO completo + 1.000 MT de bônus! Bot automático, predições ilimitadas e muito mais. |
| **ID do Produto** (se disponível) | predidly_pro |

2. **URL de Redirecionamento Após Pagamento:**

```
https://predidly-bot.vercel.app/?shared_password=Raffle!2025$X7&order_id={ORDER_ID}&product=pro
```

---

## 🔗 PASSO 3: Obter Links de Checkout

Após criar os produtos, o RatixPay vai gerar links de checkout. Anote-os:

- **Link Ativação Básica:** `https://www.ratixpay.site/checkout/CODIGO_PRODUTO_BASIC`
- **Link PRO:** `https://www.ratixpay.site/checkout/CODIGO_PRODUTO_PRO`

---

## 🔔 PASSO 4: Configurar Webhook (Opcional mas Recomendado)

Se o RatixPay suportar webhooks:

1. Vá em **Configurações** → **Webhooks** ou **Integrações**
2. Adicione um novo webhook:

| Campo | Valor |
|-------|-------|
| **URL** | `https://predidly-bot.vercel.app/api/webhook` |
| **Método** | POST |
| **Eventos** | Pagamento Aprovado / Completed / Paid |
| **Formato** | JSON |

3. O webhook espera receber estes campos:
```json
{
  "transaction_id": "TXN-12345",
  "product_id": "predidly_basic",
  "customer_phone": "258841234567",
  "customer_email": "cliente@email.com",
  "customer_name": "Nome do Cliente",
  "amount": 100,
  "status": "approved"
}
```

---

## 📱 PASSO 5: Atualizar Links no App

Precisamos atualizar os links de checkout no código. Os links atuais estão:

### Link Ativação Básica (linha ~326 do JS minificado):
```
https://novatrip.infinityfreeapp.com/produto/predicfly-active/
```
**Mudar para:** Seu link do RatixPay para ativação básica

### Link PRO:
```
https://novatrip.infinityfreeapp.com/produto/predictafly-pro/
```
**Mudar para:** Seu link do RatixPay para PRO

---

## 🚀 PASSO 6: Deploy no Vercel

1. **Crie conta no Vercel:** https://vercel.com
2. **Importe o projeto:**
   - Clique em "Add New" → "Project"
   - Conecte seu GitHub ou faça upload da pasta
3. **Configure:**
   - Nome do projeto: `predidly-bot`
   - Framework: Other
4. **Deploy!**

Sua URL será: `https://predidly-bot.vercel.app`

---

## 🔄 FLUXO COMPLETO DO USUÁRIO

```
1. Usuário abre https://predidly-bot.vercel.app
   ↓
2. Clica em "Ativar Conta"
   ↓
3. Redireciona para RatixPay (link de checkout)
   ↓
4. Usuário paga via M-Pesa
   ↓
5. RatixPay confirma pagamento
   ↓
6. Redireciona de volta para:
   https://predidly-bot.vercel.app/?shared_password=Raffle!2025$X7&order_id=123
   ↓
7. App detecta os parâmetros na URL
   ↓
8. Ativa conta no localStorage
   ↓
9. Usuário tem acesso completo! 🎉
```

---

## 🧪 TESTE O SISTEMA

### Teste Local:
1. Acesse: `http://localhost:3000/?shared_password=Raffle!2025$X7&order_id=TEST123`
2. O app deve ativar automaticamente e mostrar o toast de sucesso

### Teste em Produção:
1. Faça um pagamento de teste no RatixPay
2. Verifique se redireciona corretamente
3. Verifique se a conta é ativada

---

## ⚠️ SEGURANÇA

### A senha `Raffle!2025$X7` é a chave de ativação!

**Para mudar a senha (recomendado):**

1. Escolha uma nova senha forte
2. Atualize no RatixPay (URL de redirecionamento)
3. Atualize no código JavaScript:
   - Procure por `FO="Raffle!2025$X7"` no arquivo JS
   - Substitua pela nova senha

---

## 📞 CAMPOS DO CHECKOUT - IMPORTANTE!

Certifique-se que o checkout do RatixPay pede:

- ✅ **Nome completo** (obrigatório)
- ✅ **Email** (obrigatório)
- ✅ **Telefone** (OBRIGATÓRIO - é o identificador único!)

---

## 🆘 PROBLEMAS COMUNS

### ❌ Ativação não funciona após pagamento

**Causa:** URL de redirecionamento incorreta
**Solução:** Verifique se a URL tem `shared_password=Raffle!2025$X7`

### ❌ Parâmetros não aparecem na URL

**Causa:** RatixPay não está redirecionando corretamente
**Solução:** Verifique as configurações de redirecionamento no RatixPay

### ❌ Erro "Password não encontrada ou inválida"

**Causa:** A senha na URL não bate com a do código
**Solução:** Verifique se a senha está exatamente igual (case-sensitive)

---

## 📝 CHECKLIST FINAL

- [ ] Produto Básico criado no RatixPay
- [ ] Produto PRO criado no RatixPay
- [ ] URLs de redirecionamento configuradas
- [ ] Webhook configurado (opcional)
- [ ] Projeto deployado no Vercel
- [ ] Links de checkout atualizados no código
- [ ] Teste de pagamento realizado

---

## 📧 SUPORTE

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs no painel do Vercel
3. Teste a URL manualmente com os parâmetros
