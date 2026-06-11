# APP ICB - Backend

Backend do aplicativo de gestão para instituição religiosa.

Este projeto fornece uma API para gerenciamento de membros, autenticação, movimentações financeiras, relatórios e controle de permissões por cargo.

## Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL / Supabase
* JWT
* bcryptjs
* CORS
* dotenv

## Funcionalidades

### Autenticação

* Login com e-mail e senha
* Geração de token JWT
* Consulta do usuário autenticado
* Alteração de senha
* Proteção de rotas com middleware de autenticação

### Membros

* Cadastro de membros
* Listagem de membros ativos
* Listagem de membros inativos
* Busca de membro por ID
* Atualização de dados do membro
* Inativação de membro usando soft delete
* Restauração de membro inativo

### Financeiro

* Cadastro de entradas e saídas
* Categorias como dízimo, oferta, energia, água, aluguel, manutenção e outros
* Listagem de movimentações financeiras
* Filtros por tipo, categoria, membro, mês e ano
* Busca de movimentação por ID
* Atualização de movimentação financeira
* Exclusão de movimentação financeira

### Relatórios

* Resumo financeiro mensal
* Total de entradas
* Total de saídas
* Saldo
* Total de dízimos
* Total de ofertas
* Últimas movimentações
* Total de membros

### Permissões

O sistema utiliza cargos para controlar acesso às rotas:

* ADMIN
* TESOUREIRO
* VOLUNTARIO
* MEMBRO

## Estrutura de pastas

```txt
src/
  @types/
  database/
  errors/
  middlewares/
  modules/
    auth/
    members/
    finance/
    reports/
  routes/
  app.ts
  server.ts
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
DATABASE_URL="sua_url_do_banco_postgresql"
JWT_SECRET="sua_chave_secreta_jwt"
```

Nunca envie o arquivo `.env` para o GitHub.

## Instalação

Instale as dependências:

```bash
npm install
```

## Rodando as migrations

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

## Seed do administrador

Para criar um usuário administrador padrão, execute:

```bash
npx prisma db seed
```

Usuário padrão criado pelo seed:

```txt
Email: admin@igreja.com
Senha: 123456
```

Após o primeiro login, recomenda-se alterar a senha.

## Rodando o projeto

Inicie o servidor em ambiente de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3333
```

## Rotas principais

### Auth

```http
POST  /auth/login
GET   /auth/me
PATCH /auth/change-password
```

### Members

```http
GET    /members
GET    /members/inactive
GET    /members/:id
POST   /members
PUT    /members/:id
DELETE /members/:id
PATCH  /members/:id/restore
```

### Finance

```http
GET    /transactions
GET    /transactions/:id
POST   /transactions
PUT    /transactions/:id
DELETE /transactions/:id
```

### Reports

```http
GET /reports/summary
```

## Padrão de resposta da API

Respostas de sucesso seguem o padrão:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": {}
}
```

Respostas de erro seguem o padrão:

```json
{
  "success": false,
  "message": "Mensagem do erro."
}
```

## Testes manuais

As rotas podem ser testadas usando o arquivo:

```txt
requisicoes.http
```

Fluxo recomendado:

```txt
1. Rodar o backend
2. Fazer login
3. Copiar o token JWT
4. Usar o token nas rotas protegidas
5. Testar membros, financeiro e relatórios
```

## Observações de segurança

* As senhas são armazenadas criptografadas com bcrypt.
* As rotas protegidas exigem token JWT.
* Algumas rotas exigem cargos específicos, como ADMIN ou TESOUREIRO.
* O arquivo `.env` deve ficar fora do controle de versão.
* O usuário administrador padrão deve ter a senha alterada após o primeiro acesso.

## Status do projeto

Backend em desenvolvimento para MVP.

Funcionalidades principais já implementadas:

* Autenticação
* Membros
* Financeiro
* Relatórios
* Permissões
* Soft delete
* Seed de administrador
* Padronização de respostas
