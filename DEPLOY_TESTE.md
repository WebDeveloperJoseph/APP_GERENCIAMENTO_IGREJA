# APP ICB - Primeiro acesso e teste real

## 1. Primeiro administrador

Configure no ambiente do backend:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=uma-chave-longa-e-aleatoria
INITIAL_ADMIN_NAME=Administrador da Igreja
INITIAL_ADMIN_EMAIL=admin@suaigreja.com
INITIAL_ADMIN_PASSWORD=uma-senha-temporaria-forte
```

Execute:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm start
```

O seed cria somente o primeiro administrador. Se o e-mail já existir, ele não
altera nem duplica o usuário.

No primeiro login, o aplicativo obriga a troca da senha temporária.

## 2. Demais usuários

O administrador ou voluntário cadastra membros pelo aplicativo.

- Usuários com senha recebem acesso ao sistema.
- A primeira senha é temporária e deve ser trocada no primeiro login.
- Membros sem senha ficam apenas como cadastro da igreja.
- Usuários inativos não conseguem entrar.
- Somente administradores podem editar cargo e inativar usuários.

## 3. Backend para teste externo

O aplicativo instalado precisa acessar uma API pública com HTTPS. Configure o
backend em um serviço Node.js e defina:

```env
DATABASE_URL=...
JWT_SECRET=...
PORT=3333
```

Comandos:

```bash
npm install
npm run db:migrate
npm start
```

As imagens são gravadas em `backend/uploads`. A hospedagem precisa ter volume
persistente montado nesse diretório. Sem volume, fotos podem desaparecer após
reinícios ou novos deploys.

## 4. Configurar o build mobile

Na pasta `mobile`:

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://sua-api.com
```

Gerar APK Android para instalação direta:

```bash
npx eas-cli build --platform android --profile preview
```

Ao terminar, o EAS fornece um link para baixar e instalar o APK.

## 5. Teste rápido na mesma rede

Para testar com Expo Go antes do APK:

```bash
cd backend
npm run dev
```

Em outro terminal:

```bash
cd mobile
npx expo start
```

O celular e o computador precisam estar na mesma rede Wi-Fi. A variável
`EXPO_PUBLIC_API_URL` deve apontar para o IP do computador, nunca para
`localhost`.
