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

    const passwordHash = await bcrypt.hash(password, 12);
    const configuredTrialDays = Number(process.env.SUBSCRIPTION_TRIAL_DAYS ?? 14);
    const trialDays = Number.isInteger(configuredTrialDays)
      ? Math.min(Math.max(configuredTrialDays, 1), 90)
      : 14;
    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    const { church, admin } = await prisma.$transaction(async (tx) => {
      const plan = await tx.plan.upsert({
        where: { code: "STARTER" },
        update: {},
        create: {
          code: "STARTER",
          name: "Essencial",
          description: "Plano inicial para igrejas em implantação.",
          priceCents: 9900,
          maxMembers: 300,
          features: ["members", "events", "finance", "communications"],
        },
      });

      const createdChurch = await tx.church.create({
        data: {
          name: normalizedChurchName,
          slug,
          city: city?.trim() || null,
          state: state?.trim().toUpperCase().slice(0, 2) || null,
          subscription: {
            create: {
              planId: plan.id,
              status: "TRIALING",
              trialEndsAt,
            },
          },
        },
      });

      const createdAdmin = await tx.member.create({
        data: {
          name: normalizedResponsibleName,
          email: normalizedEmail,
          phone: phone?.trim() || null,
          password: passwordHash,
          role: "ADMIN",
          isSuperAdmin: false,
          isActive: true,
          mustChangePassword: false,
          churchId: createdChurch.id,
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

      return { church: createdChurch, admin: createdAdmin };
    });

    return {
      church,
      admin,
      trialEndsAt,
    };
  }
}

async function getRecentChurches() {
  const churches = await prisma.church.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}

export { ChurchesService, getRecentChurches };
