# 📋 GUIA DE CONFIGURAÇÃO - Predidly Bot

## 🏗️ Estrutura do Projeto

```
predidly-bot/
├── index.html          # Página principal
├── vercel.json         # Configuração do Vercel
├── package.json        # Dependências
├── api/
│   ├── webhook.js      # Recebe pagamentos do RatixPay
│   ├── check-activation.js  # Verifica se conta está ativa
│   └── recharge.js     # Processa recargas
├── data/
│   └── activations.json  # Banco de dados
├── css/
│   └── index-CB3bEj15.css
├── js/
│   └── index-Dowo4TYh.js
└── images/
```

---

## 🚀 PASSO 1: Deploy no Vercel

1. Acesse https://vercel.com e faça login
2. Clique em "Add New" → "Project"
3. Importe o projeto do GitHub ou faça upload da pasta
4. O Vercel vai detectar automaticamente o `vercel.json`
5. Clique em "Deploy"
6. Sua URL será: `https://predidly-bot.vercel.app`

---

## 💳 PASSO 2: Configurar RatixPay

### Acesse: https://www.ratixpay.site/
### Login: fbilionario01@gmail.com

### 2.1 Criar Produto 1: Ativação Básica

| Campo | Valor |
|-------|-------|
| Nome | Ativação Predidly Bot |
| Preço | 100 MZN |
| ID do Produto | `predidly_basic` |
| Descrição | Ative sua conta e receba +200 MT de bônus |

### 2.2 Criar Produto 2: PRO

| Campo | Valor |
|-------|-------|
| Nome | Predidly Bot PRO |
| Preço | 269 MZN |
| ID do Produto | `predidly_pro` |
| Descrição | Acesso PRO + 1000 MT de bônus |

### 2.3 Configurar Webhook

Na seção de **Integrações** ou **Webhooks**:

| Campo | Valor |
|-------|-------|
| URL do Webhook | `https://predidly-bot.vercel.app/api/webhook` |
| Método | POST |
| Eventos | Pagamento Aprovado / Completed |

### 2.4 Campos Obrigatórios no Checkout

Certifique-se que o checkout do RatixPay pede:
- ✅ Nome do cliente
- ✅ Email do cliente  
- ✅ **Telefone do cliente** (OBRIGATÓRIO!)

---

## 🔗 PASSO 3: Atualizar Links no App

Os botões de checkout no app precisam apontar para os links do RatixPay.

### Link Ativação Básica:
```
https://www.ratixpay.site/checkout/SEU_PRODUTO_BASIC
```

### Link PRO:
```
https://www.ratixpay.site/checkout/SEU_PRODUTO_PRO
```

---

## 📱 PASSO 4: Fluxo do Usuário

```
1. Usuário abre o app
2. Clica em "Ativar Conta"
3. Insere seu número de telefone
4. Redireciona para RatixPay
5. Paga via M-Pesa
6. RatixPay envia webhook para seu servidor
7. Servidor ativa a conta
8. Usuário volta ao app e faz login com o telefone
9. App verifica no servidor → Conta ativa!
```

---

## 🧪 PASSO 5: Testar Webhook

Você pode testar o webhook manualmente:

```bash
curl -X POST https://predidly-bot.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TEST-123",
    "product_id": "predidly_basic",
    "customer_phone": "258841234567",
    "customer_email": "teste@email.com",
    "customer_name": "Teste Usuario",
    "amount": 100,
    "status": "approved"
  }'
```

---

## 📊 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/webhook` | POST | Recebe notificações de pagamento |
| `/api/check-activation?phone=258...` | GET | Verifica se telefone está ativo |
| `/api/recharge` | POST | Adiciona saldo após recarga |

---

## ⚠️ Notas Importantes

1. **Banco de Dados**: O arquivo `data/activations.json` é um banco simples. Para produção com muitos usuários, considere usar Vercel Postgres ou PlanetScale.

2. **Segurança**: Adicione verificação de assinatura do webhook para garantir que só o RatixPay pode enviar.

3. **Telefone**: O número de telefone é a chave única. Certifique-se que o RatixPay envia este campo.

---

## 📞 Suporte

Se precisar de ajuda, verifique:
- Console do Vercel para logs das APIs
- Painel do RatixPay para status dos webhooks
