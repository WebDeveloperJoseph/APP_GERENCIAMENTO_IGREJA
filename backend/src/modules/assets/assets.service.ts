import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type AssetStatus = "ATIVO" | "MANUTENCAO" | "BAIXADO";

interface AssetData {
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
  async list({ search, status }: ListAssetsFilters) {
    if (status && !validStatuses.includes(status as AssetStatus)) {
      throw new AppError("Status do bem inválido.", 400);
    }

    return prisma.asset.findMany({
      where: {
        status: status as AssetStatus | undefined,
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async show(id: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
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

  async update(id: string, data: AssetData) {
    await this.show(id);
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

  async delete(id: string) {
    await this.show(id);

    await prisma.asset.delete({
      where: { id },
    });
  }
}

export { AssetsService };
