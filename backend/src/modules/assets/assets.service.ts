import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type AssetStatus = "ATIVO" | "MANUTENCAO" | "BAIXADO";

interface AssetData {
  churchId: string; // 🔑 Obrigatório para isolamento
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  category: string;
  value: number;
  acquisitionDate?: string | null;
  location?: string | null;
  status: AssetStatus;
}

interface ListAssetsFilters {
  churchId: string; // 🔑 Obrigatório para a listagem restrita
  search?: string;
  status?: string;
}

const validStatuses: AssetStatus[] = ["ATIVO", "MANUTENCAO", "BAIXADO"];

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Data de aquisição inválida.", 400);
  }

  return date;
}

function validateAsset(data: AssetData) {
  if (!data.churchId?.trim()) {
    throw new AppError("A identificação da igreja é obrigatória.", 400);
  }

  if (!data.name?.trim()) {
    throw new AppError("O nome do bem é obrigatório.", 400);
  }

  if (!data.category?.trim()) {
    throw new AppError("A categoria do bem é obrigatória.", 400);
  }

  if (data.value === undefined || data.value === null) {
    throw new AppError("O valor do bem é obrigatório.", 400);
  }

  if (!Number.isFinite(Number(data.value)) || Number(data.value) < 0) {
    throw new AppError("O valor do bem deve ser zero ou maior.", 400);
  }

  if (!validStatuses.includes(data.status)) {
    throw new AppError("Status do bem inválido.", 400);
  }
}

class AssetsService {
  async list({ churchId, search, status }: ListAssetsFilters) {
    if (status && !validStatuses.includes(status as AssetStatus)) {
      throw new AppError("Status do bem inválido.", 400);
    }

    return prisma.asset.findMany({
      where: {
        churchId, // 🔑 Garante que a query traga APENAS os patrimônios desta igreja
        status: status as AssetStatus | undefined,
        AND: search
          ? [
              {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { category: { contains: search, mode: "insensitive" } },
                  { location: { contains: search, mode: "insensitive" } },
                ],
              },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async show(id: string, churchId: string) {
    // 🔑 Busca garantindo que o id pertence à igreja do usuário requisitante
    const asset = await prisma.asset.findFirst({
      where: { id, churchId },
    });

    if (!asset) {
      throw new AppError("Bem patrimonial não encontrado.", 404);
    }

    return asset;
  }

  async create(data: AssetData) {
    validateAsset(data);

    return prisma.asset.create({
      data: {
        churchId: data.churchId, // 🔑 Grava a referência da igreja no banco
        name: data.name.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        description: data.description?.trim() || null,
        category: data.category.trim(),
        value: Number(data.value),
        acquisitionDate: parseDate(data.acquisitionDate),
        location: data.location?.trim() || null,
        status: data.status,
      },
    });
  }

  async update(id: string, churchId: string, data: AssetData) {
    // 🔑 Verifica se o patrimônio existe E se pertence a essa igreja antes de atualizar
    await this.show(id, churchId);
    validateAsset(data);

    return prisma.asset.update({
      where: { id },
      data: {
        name: data.name.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        description: data.description?.trim() || null,
        category: data.category.trim(),
        value: Number(data.value),
        acquisitionDate: parseDate(data.acquisitionDate),
        location: data.location?.trim() || null,
        status: data.status,
      },
    });
  }

  async delete(id: string, churchId: string) {
    // 🔑 Bloqueia a exclusão se o ID do patrimônio for de outra igreja
    await this.show(id, churchId);

    await prisma.asset.delete({
      where: { id },
    });
  }
}

export { AssetsService };
