# 🚀 Guia de Deploy - Facebook Conversions API (CAPI)

Este guia explica como deployar a Edge Function do Supabase para enviar eventos para a API de Conversão do Facebook.

## 📋 Pré-requisitos

1. Conta no Supabase (você já tem: `ziykvuzsoowplncwedxf`)
2. Supabase CLI instalado

## 🛠️ Passo 1: Instalar Supabase CLI

Abra o terminal e execute:

```powershell
npm install -g supabase
```

## 🔐 Passo 2: Fazer Login no Supabase

```powershell
supabase login
```

Isso vai abrir o navegador para autenticar.

## 🔗 Passo 3: Linkar o Projeto

Na pasta do projeto (f:\predidly bot page\predidly bot), execute:

```powershell
cd "f:\predidly bot page\predidly bot"
supabase link --project-ref ziykvuzsoowplncwedxf
```

## 🚀 Passo 4: Deploy da Edge Function

```powershell
supabase functions deploy facebook-capi --no-verify-jwt
```

O `--no-verify-jwt` permite chamadas sem autenticação (necessário para eventos do frontend).

## ✅ Passo 5: Testar a Função

Após o deploy, a função estará disponível em:
```
https://ziykvuzsoowplncwedxf.supabase.co/functions/v1/facebook-capi
```

Teste com curl:
```powershell
curl -X POST "https://ziykvuzsoowplncwedxf.supabase.co/functions/v1/facebook-capi" `
  -H "Content-Type: application/json" `
  -d '{"event_name": "PageView", "event_source_url": "https://predidly-bot.vercel.app"}'
```

## 📝 Passo 6: Integrar no Frontend

Adicione o script no `index.html`:

```html
<script src="js/facebook-capi.js"></script>
<script>
  // Enviar PageView quando a página carrega
  document.addEventListener('DOMContentLoaded', function() {
    FacebookCAPI.pageView();
  });
  
  // Exemplo: Enviar AddToCart quando clicar no botão
  document.getElementById('checkout-btn').addEventListener('click', function() {
    FacebookCAPI.addToCart(100, 'Licença Predidly Bot');
  });
</script>
```

## 🔧 Eventos Disponíveis

| Método | Evento Facebook | Quando Usar |
|--------|-----------------|-------------|
| `FacebookCAPI.pageView()` | PageView | Carregamento da página |
| `FacebookCAPI.viewContent('Nome')` | ViewContent | Ver detalhes do produto |
| `FacebookCAPI.initiateCheckout()` | InitiateCheckout | Clicar em "Começar" |
| `FacebookCAPI.addToCart(valor)` | AddToCart | Clicar no checkout |
| `FacebookCAPI.purchase(valor, email, telefone)` | Purchase | Compra confirmada |

## ⚠️ Notas Importantes

1. **Duplicidade de Eventos**: O Pixel do navegador e a CAPI podem enviar os mesmos eventos. O Facebook desduplicará automaticamente se os Event IDs coincidirem.

2. **Token de Segurança**: O token da API está armazenado na Edge Function (servidor), não exposto no frontend.

3. **Monitoramento**: Verifique os eventos no Gerenciador de Eventos do Facebook em "Eventos de Teste".

---

Configurado por Antigravity AI em Dezembro de 2025.
