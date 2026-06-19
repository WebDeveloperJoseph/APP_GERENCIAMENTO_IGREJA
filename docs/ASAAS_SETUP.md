# Configuração do Asaas

## 1. Sandbox

1. Crie uma conta em https://sandbox.asaas.com/.
2. Em **Integrações > Chave de API**, gere uma chave exclusiva para o backend.
3. Gere também um token aleatório de webhook com 32 a 255 caracteres.
4. Configure no ambiente do backend:

```env
ASAAS_ENV=sandbox
ASAAS_API_KEY=$aact_...
ASAAS_WEBHOOK_TOKEN=token-longo-e-aleatorio
APP_WEB_URL=http://localhost:3000
ASAAS_CALLBACK_URL=https://seu-frontend-publico.com.br
```

Nunca coloque essas chaves no frontend ou no repositório.

## 2. Webhook

Cadastre no Asaas uma URL HTTPS pública:

```text
https://SEU_BACKEND/webhooks/asaas
```

Use em **Token de autenticação** exatamente o mesmo valor de
`ASAAS_WEBHOOK_TOKEN`. Para desenvolvimento local, exponha temporariamente o
backend com Cloudflare Tunnel ou ngrok.

Eventos mínimos:

- `SUBSCRIPTION_CREATED`
- `SUBSCRIPTION_UPDATED`
- `SUBSCRIPTION_INACTIVATED`
- `SUBSCRIPTION_DELETED`
- `PAYMENT_CREATED`
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`
- `PAYMENT_OVERDUE`
- `PAYMENT_REFUNDED`
- `PAYMENT_DELETED`
- `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`

## 3. Produção

Depois de validar todo o ciclo no sandbox, gere novas credenciais na conta de
produção e altere somente:

```env
ASAAS_ENV=production
ASAAS_API_KEY=chave-de-producao
ASAAS_WEBHOOK_TOKEN=outro-token-exclusivo
APP_WEB_URL=https://seu-frontend.com.br
ASAAS_CALLBACK_URL=https://seu-frontend.com.br
```

Não reutilize chaves ou tokens do sandbox em produção.
