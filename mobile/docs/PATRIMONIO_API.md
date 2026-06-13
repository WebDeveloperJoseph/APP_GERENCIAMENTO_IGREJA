# API de Patrimônio

O backend e o aplicativo possuem CRUD de bens patrimoniais.

## Estrutura esperada

```ts
interface Asset {
  id: string;
  name: string;
  description: string | null;
  category: string;
  value: number;
  acquisitionDate: string | null;
  location: string | null;
  status: "ATIVO" | "MANUTENCAO" | "BAIXADO";
  createdAt: string;
  updatedAt: string;
}
```

## Endpoints

- `GET /assets`
- `GET /assets/:id`
- `POST /assets`
- `PUT /assets/:id`
- `DELETE /assets/:id`

As respostas devem seguir o padrão já utilizado pelo projeto:

```json
{
  "success": true,
  "message": "Mensagem de sucesso",
  "data": {}
}
```

## Permissões

- Listar e visualizar: `ADMIN` e `TESOUREIRO`
- Cadastrar e editar: `ADMIN` e `TESOUREIRO`
- Excluir ou baixar: `ADMIN`
