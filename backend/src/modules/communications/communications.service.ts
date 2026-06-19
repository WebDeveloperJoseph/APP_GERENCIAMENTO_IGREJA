import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type CommunicationStatus = "RASCUNHO" | "ENVIADO";

type CreateNoticeDTO = {
  title: string;
  message: string;
  audience: string;
  channel?: string;
  status?: CommunicationStatus;
  churchId: string;
  createdById: string;
};

type UpdateNoticeDTO = {
  title?: string;
  message?: string;
  audience?: string;
  channel?: string;
  status?: CommunicationStatus;
};

class CommunicationsService {
  async list(churchId: string) {
    return prisma.communicationNotice.findMany({
      where: { churchId },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async create(data: CreateNoticeDTO) {
    const title = data.title?.trim();
    const message = data.message?.trim();
    const audience = data.audience?.trim();

    if (!title) {
      throw new AppError("Título é obrigatório.", 400);
    }

    if (!message) {
      throw new AppError("Mensagem é obrigatória.", 400);
    }

    if (!audience) {
      throw new AppError("Público alvo é obrigatório.", 400);
    }

    return prisma.communicationNotice.create({
      data: {
        title,
        message,
        audience,
        channel: data.channel?.trim() || "APP",
        status: data.status ?? "ENVIADO",
        churchId: data.churchId,
        createdById: data.createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async update(id: string, churchId: string, data: UpdateNoticeDTO) {
    const existing = await prisma.communicationNotice.findFirst({
      where: { id, churchId },
    });

    if (!existing) {
      throw new AppError("Comunicado não encontrado.", 404);
    }

    return prisma.communicationNotice.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        message: data.message?.trim(),
        audience: data.audience?.trim(),
        channel: data.channel?.trim(),
        status: data.status,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async delete(id: string, churchId: string) {
    const existing = await prisma.communicationNotice.findFirst({
      where: { id, churchId },
    });

    if (!existing) {
      throw new AppError("Comunicado não encontrado.", 404);
    }

    await prisma.communicationNotice.delete({ where: { id } });
  }
}

export { CommunicationsService };
