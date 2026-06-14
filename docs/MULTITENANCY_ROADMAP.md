# Preparação para multitenancy

O APP ICB continua operando como uma aplicação de igreja única. A evolução
para SaaS deve ser feita como uma migração própria, não apenas adicionando um
campo opcional nas tabelas atuais.

## Estrutura recomendada

1. Criar `Tenant` para representar cada igreja.
2. Criar associação entre usuários e igrejas, permitindo papéis por igreja.
3. Adicionar `tenantId` obrigatório em eventos, membros, finanças, patrimônio,
   imagens e tokens de notificação.
4. Resolver o tenant autenticado no middleware e nunca aceitar `tenantId`
   diretamente do corpo enviado pelo aplicativo.
5. Centralizar consultas por tenant para impedir acesso cruzado.
6. Criar índices compostos e unicidade por tenant, especialmente para e-mail.
7. Armazenar nome, logo e cores da igreja no tenant e carregar isso no tema
   já existente do mobile.
8. Migrar os dados atuais para um tenant inicial antes de tornar `tenantId`
   obrigatório.

## Regra de segurança

Nenhuma rota deve consultar dados de negócio apenas por `id`. Toda leitura,
alteração ou exclusão deverá combinar o identificador do registro com o
`tenantId` obtido da sessão autenticada.
