**Mapa do projeto (web) — visão geral e features sugeridas**

Estrutura principal (resumida):

- `src/services`: camada de integração com API (auth, members, events, dashboard, transactions, owner)
- `src/pages`: telas organizadas por roles (church-admin, owner-admin, public, member-web)
- `src/components`: UI reutilizável (charts, layout, ui)

Funcionalidades essenciais para um SaaS de gestão de igrejas:

1. Autenticação e autorização
   - Login seguro, refresh token, MFA para admins, políticas de senha
   - RBAC: roles (MEMBRO, VOLUNTARIO, PASTOR, TESOUREIRO, ADMIN, OWNER)

2. Multi-tenancy e isolamento
   - Validação de tenant em backend e front (header `x-church-id`)
   - Planejamento para dados segregados e backups por tenant

3. Cobrança e assinaturas
   - Integração com provedor (Stripe/PagSeguro)
   - Webhooks seguros, callbacks verificados, histórico de cobrança

4. Auditoria e logs
   - Audit trail de ações administrativas (criar/editar/excluir membros, permissões)

5. Monitoramento e alertas
   - Uptime/health checks, Sentry para erros, métricas de uso

6. Privacidade e compliance
   - Criptografia de dados sensíveis, políticas de retenção, consentimento

7. UX e confiabilidade
   - Fallbacks, loaders, tratamento de erros consistente, testes automatizados

Prioridades de implementação que eu recomendo começar agora:

- Implementar hooks de dados (`useMembers`, `useEvents`, `useOwnerChurches`) com loading/error states
- Centralizar tratamento de erros e feedback (toast/alert) global
- Fortalecer segurança: CSP (feito), troca para HttpOnly cookies (coordenação backend)
- Auditoria mínima: logar ações críticas no frontend e enviar ao backend

Diga qual destas prioridades prefere que eu implemente primeiro e eu inicio.
