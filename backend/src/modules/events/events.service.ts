import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

interface EventData {
  title: string;
  description?: string | null;
  location?: string | null;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  isPublic?: boolean;
}

interface CreateEventData extends EventData {
  createdById: string;
}

interface ListEventsFilters {
  month?: number;
  year?: number;
}

function parseRequiredDate(value: string, fieldName: string) {
  if (!value) {
    throw new AppError(`${fieldName} é obrigatória.`, 400);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${fieldName} é inválida.`, 400);
  }

  return date;
}

function validateEvent(data: EventData) {
  if (!data.title?.trim()) {
    throw new AppError("O título do evento é obrigatório.", 400);
  }

  const startDate = parseRequiredDate(data.startDate, "A data de início");
  const endDate = parseRequiredDate(data.endDate, "A data de término");

  if (endDate < startDate) {
    throw new AppError(
      "A data de término não pode ser anterior à data de início.",
      400,
    );
  }

  return { startDate, endDate };
}

class EventsService {
  async list({ month, year }: ListEventsFilters) {
    if (
      month !== undefined &&
      (!Number.isInteger(month) || month < 1 || month > 12)
    ) {
      throw new AppError("Mês inválido. Use um valor entre 1 e 12.", 400);
    }

    if (
      year !== undefined &&
      (!Number.isInteger(year) || year < 2000)
    ) {
      throw new AppError("Ano inválido.", 400);
    }

    let periodFilter:
      | {
          start: Date;
          end: Date;
        }
      | undefined;

    if (month !== undefined || year !== undefined) {
      const currentDate = new Date();
      const selectedMonth = month ?? currentDate.getMonth() + 1;
      const selectedYear = year ?? currentDate.getFullYear();

      periodFilter = {
        start: new Date(selectedYear, selectedMonth - 1, 1),
        end: new Date(selectedYear, selectedMonth, 1),
      };
    }

    return prisma.event.findMany({
      where: periodFilter
        ? {
            startDate: {
              lt: periodFilter.end,
            },
            endDate: {
              gte: periodFilter.start,
            },
          }
        : undefined,
      orderBy: {
        startDate: "asc",
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

  async show(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
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

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return event;
  }

  async create(data: CreateEventData) {
    const { startDate, endDate } = validateEvent(data);

    return prisma.event.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        location: data.location?.trim() || null,
        coverImageUrl: data.coverImageUrl?.trim() || null,
        startDate,
        endDate,
        isPublic: data.isPublic ?? true,
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

  async update(id: string, data: EventData) {
    await this.show(id);
    const { startDate, endDate } = validateEvent(data);

    return prisma.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        location: data.location?.trim() || null,
        coverImageUrl: data.coverImageUrl?.trim() || null,
        startDate,
        endDate,
        isPublic: data.isPublic ?? true,
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

  async delete(id: string) {
    await this.show(id);

    await prisma.event.delete({
      where: { id },
    });
  }
}

export { EventsService };
