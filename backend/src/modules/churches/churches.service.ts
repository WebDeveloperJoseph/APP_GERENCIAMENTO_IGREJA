import bcrypt from "bcryptjs";

import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

interface CreateChurchDTO {
  churchName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  membersCount?: number;
  responsibleName: string;
  password: string;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

class ChurchesService {
  async create({
    churchName,
    email,
    phone,
    city,
    state,
    responsibleName,
    password,
  }: CreateChurchDTO) {
    const normalizedChurchName = churchName?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedResponsibleName = responsibleName?.trim();

    if (!normalizedChurchName) {
      throw new AppError("Nome da igreja e obrigatorio.", 400);
    }

    if (!normalizedEmail) {
      throw new AppError("E-mail e obrigatorio.", 400);
    }

    if (!normalizedResponsibleName) {
      throw new AppError("Nome do responsavel e obrigatorio.", 400);
    }

    if (!password || password.length < 6) {
      throw new AppError("A senha deve ter pelo menos 6 caracteres.", 400);
    }

    const emailAlreadyExists = await prisma.member.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (emailAlreadyExists) {
      throw new AppError("Este e-mail ja esta em uso.", 409);
    }

    const baseSlug = slugify(normalizedChurchName);
    let slug = baseSlug;
    let suffix = 1;

    while (await prisma.church.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const church = await prisma.church.create({
      data: {
        name: normalizedChurchName,
        slug,
      },
    });

    const admin = await prisma.member.create({
      data: {
        name: normalizedResponsibleName,
        email: normalizedEmail,
        phone: phone?.trim() || null,
        password: await bcrypt.hash(password, 8),
        role: "ADMIN",
        isSuperAdmin: false,
        isActive: true,
        mustChangePassword: false,
        churchId: church.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isSuperAdmin: true,
        churchId: true,
        createdAt: true,
      },
    });

    return {
      church: {
        ...church,
        city,
        state,
      },
      admin,
    };
  }
}

export { ChurchesService };
