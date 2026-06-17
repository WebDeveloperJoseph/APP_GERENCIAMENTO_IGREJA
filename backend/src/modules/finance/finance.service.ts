import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type TransactionType = "ENTRADA" | "SAIDA";

type TransactionCategory =
  | "DIZIMO"
  | "OFERTA"
  | "ALUGUEL"
  | "ENERGIA"
  | "AGUA"
  | "MANUTENCAO"
  | "OUTROS";

interface CreateTransactionDTO {
  type: TransactionType;
  category: TransactionCategory;
  value: number;
  description?: string;
  memberId?: string;
  date?: string;
}

interface ListTransactionsFiltersDTO {
  month?: number;
  year?: number;
  type?: string;
  category?: string;
  memberId?: string;
}

interface UpdateTransactionDTO {
  type?: TransactionType;
  category?: TransactionCategory;
  value?: number;
  description?: string;
  memberId?: string;
  date?: string;
}

class FinanceService {
  // 🔑 Multi-Tenant: Adicionado churchId como parâmetro obrigatório na listagem
  async list(
    { month, year, type, category, memberId }: ListTransactionsFiltersDTO,
    churchId: string,
  ) {
    const validTypes: TransactionType[] = ["ENTRADA", "SAIDA"];

    if (type && !validTypes.includes(type as TransactionType)) {
      throw new AppError("Tipo de movimentação inválido.", 400);
    }

    const validCategories: TransactionCategory[] = [
      "DIZIMO",
      "OFERTA",
      "ALUGUEL",
      "ENERGIA",
      "AGUA",
      "MANUTENCAO",
      "OUTROS",
    ];

    if (
      category &&
      !validCategories.includes(category as TransactionCategory)
    ) {
      throw new AppError("Categoria inválida.", 400);
    }

    if (month && (month < 1 || month > 12)) {
      throw new AppError("Mês inválido. Use um valor entre 1 e 12.", 400);
    }

    if (year && year < 2000) {
      throw new AppError("Ano inválido.", 400);
    }

    // 🛡️ Multi-Tenant: O filtro inicial já garante apenas dados da igreja ativa
    const where: any = {
      churchId,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (memberId) {
      where.memberId = memberId;
    }

    if (month || year) {
      const currentDate = new Date();

      const selectedMonth = month ?? currentDate.getMonth() + 1;
      const selectedYear = year ?? currentDate.getFullYear();

      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 1);

      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      include: {
        member: true,
      },
    });

    return transactions;
  }

  // 🔑 Multi-Tenant: Adicionado churchId na criação
  async create(
    {
      type,
      category,
      value,
      description,
      memberId,
      date,
    }: CreateTransactionDTO,
    churchId: string,
  ) {
    const validTypes: TransactionType[] = ["ENTRADA", "SAIDA"];

    if (!type) {
      throw new AppError("O tipo da movimentação é obrigatório.", 400);
    }

    if (!validTypes.includes(type)) {
      throw new AppError("Tipo de movimentação inválido.", 400);
    }

    const validCategories: TransactionCategory[] = [
      "DIZIMO",
      "OFERTA",
      "ALUGUEL",
      "ENERGIA",
      "AGUA",
      "MANUTENCAO",
      "OUTROS",
    ];

    if (!category) {
      throw new AppError("A categoria da movimentação é obrigatória.", 400);
    }

    if (!validCategories.includes(category)) {
      throw new AppError("Categoria inválida.", 400);
    }

    if (value === undefined || value === null) {
      throw new AppError("O valor é obrigatório.", 400);
    }

    if (Number(value) <= 0) {
      throw new AppError("O valor precisa ser maior que zero.", 400);
    }

    if (memberId) {
      // 🔑 Multi-Tenant: Garante que o membro associado pertence a essa mesma igreja
      const memberExists = await prisma.member.findFirst({
        where: {
          id: memberId,
          churchId,
        },
      });

      if (!memberExists) {
        throw new AppError("Membro informado não existe nesta igreja.", 400);
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        category,
        value,
        description,
        memberId,
        churchId, // 🔑 Vínculo do Tenant automático no banco
        date: date ? new Date(date) : new Date(),
      },
      include: {
        member: true,
      },
    });

    return transaction;
  }

  // 🔑 Multi-Tenant: Adicionado churchId para bloquear visualização direta via ID na URL
  async show(id: string, churchId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        churchId, // 🛡️ Apenas se for da mesma igreja
      },
      include: {
        member: true,
      },
    });

    if (!transaction) {
      throw new AppError(
        "Movimentação financeira não encontrada nesta igreja.",
        404,
      );
    }

    return transaction;
  }

  // 🔑 Multi-Tenant: Proteção no Update
  async update(
    id: string,
    {
      type,
      category,
      value,
      description,
      memberId,
      date,
    }: UpdateTransactionDTO,
    churchId: string,
  ) {
    // 🔑 Multi-Tenant: Valida se a movimentação pertence a esta igreja antes de alterar
    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        churchId,
      },
    });

    if (!transactionExists) {
      throw new AppError(
        "Movimentação financeira não encontrada nesta igreja.",
        404,
      );
    }

    const validTypes: TransactionType[] = ["ENTRADA", "SAIDA"];

    if (type && !validTypes.includes(type)) {
      throw new AppError("Tipo de movimentação inválido.", 400);
    }

    const validCategories: TransactionCategory[] = [
      "DIZIMO",
      "OFERTA",
      "ALUGUEL",
      "ENERGIA",
      "AGUA",
      "MANUTENCAO",
      "OUTROS",
    ];

    if (category && !validCategories.includes(category)) {
      throw new AppError("Categoria inválida.", 400);
    }

    if (value !== undefined && Number(value) <= 0) {
      throw new AppError("O valor precisa ser maior que zero.", 400);
    }

    if (memberId) {
      // 🔑 Multi-Tenant: Valida o membro no update também
      const memberExists = await prisma.member.findFirst({
        where: {
          id: memberId,
          churchId,
        },
      });

      if (!memberExists) {
        throw new AppError("Membro informado não existe nesta igreja.", 404);
      }
    }

    const transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        type,
        category,
        value: value !== undefined ? Number(value) : undefined,
        description,
        memberId,
        date: date ? new Date(date) : undefined,
      },
      include: {
        member: true,
      },
    });

    return transaction;
  }

  // 🔑 Multi-Tenant: Proteção no Delete
  async delete(id: string, churchId: string) {
    // 🔑 Multi-Tenant: Garante a posse antes de apagar do Supabase
    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        churchId,
      },
    });

    if (!transactionExists) {
      throw new AppError(
        "Movimentação financeira não encontrada nesta igreja.",
        404,
      );
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });
  }
}

export { FinanceService };
