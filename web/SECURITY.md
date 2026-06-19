**Variáveis de ambiente úteis**

- Backend:
  - `ALLOWED_ORIGINS`: lista separada por vírgula de origens permitidas (ex: `http://localhost:3000,https://app.seu-dominio.com`).
  - `USE_COOKIE_AUTH`: `true|false` — quando `true`, o servidor setará cookie HttpOnly `igreja_token` no login.

- Frontend:
  - `VITE_API_USE_CREDENTIALS`: `true|false` — quando `true`, o frontend enviará requests com `credentials` (cookies). Deve ser `true` apenas se o backend estiver configurado com `Access-Control-Allow-Credentials: true` e `ALLOWED_ORIGINS` adequados.

**frame-ancestors (Content-Security-Policy)**

O `frame-ancestors` é ignorado quando definido via `<meta>` — deve ser enviado como header HTTP:

**Segurança Web — Igreja Connect (resumo e checklist)**

- **Resumo das mudanças já aplicadas (frontend):**
  - Políticas CSP e referrer adicionadas em `index.html`.
  - `api` configurado com `withCredentials` e token em memória para reduzir exposição a XSS.
  - Removidos mocks e ajustadas páginas para consumir a API real.
  - Utilitário `escapeHtml` adicionado para escapar strings antes de inserir em HTML.

- **Recomendações imediatas (prioridade alta):**
  - Trocar armazenamento de sessão de `localStorage` por `HttpOnly` cookies (requer backend).
  - Forçar TLS estrito (https everywhere) e HSTS no servidor.
  - Backend: usar `helmet` (ou equivalente) para headers de segurança, `rate-limit`, `express-validator`/validação forte e `cors` configurado por origem.
  - Implementar MFA (2FA) para contas administrativas.
  - Auditoria e logging de eventos sensíveis (login, alteração de assinaturas, cobrança).

**Configuração CORS recomendada (Express example)**

Quando `withCredentials` é usado no frontend (cookies ou credenciais), o servidor NÃO pode responder com `Access-Control-Allow-Origin: *`.
Exemplo em Express + cors middleware:

```js
const cors = require("cors");

const allowedOrigins = ["https://app.seudominio.com", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // permitir requests sem origin (ex: servidores, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Access-Control-Allow-Credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-church-id"],
  }),
);
```

Se você controla o backend, garanta também que os handlers de preflight (`OPTIONS`) não retornem `Access-Control-Allow-Origin: *` quando `credentials` estiver ativo.

**frame-ancestors (Content-Security-Policy)**

O `frame-ancestors` é ignorado quando definido via `<meta>` — deve ser enviado como header HTTP:

Exemplo em Express:

```js
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none';",
  );
  next();
});
```

**CSRF**

Se migrar para `HttpOnly` cookies, implemente proteção CSRF (double-submit cookie, SameSite=strict, tokens server-generated).

- **Projeto/arquitetura (segurança e confiabilidade):**
  - RBAC (roles e permissões) rígido por endpoint.
  - Isolamento multi-tenant: validação de `x-church-id` no backend e checagens de autorização por recurso.
  - Criptografia em repouso para dados sensíveis e uso de KMS para chaves.
  - Proteção de endpoints relacionados a pagamentos: PCI-compliant flows e provider terceirizado (Stripe, PagSeguro via tokenização).

- **Checklist técnico para a equipe (curto prazo):**
  1. Backend: implementar HttpOnly cookies e SameSite=strict para auth JWT/session.
  2. Frontend: remover usos de `innerHTML` e nunca inserir HTML não sanitizado; usar `escapeHtml` quando necessário.
  3. Habilitar CSP em produção com nonce-based scripts (ideal) e revisar `script-src` para evitar `unsafe-inline`.
  4. Adicionar monitoramento de segurança (Sentry, logs centralizados) e alertas para eventos suspeitos.
  5. Testes de penetração e revisão de dependências (dependabot/renovate).

Se quiser, posso começar a implementar algumas dessas recomendações: por exemplo, substituir `localStorage` por armazenamento em cookie (precisa coordenação com backend), adicionar monitoramento básico no frontend ou centralizar tratamento de erros/auth.
