import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando o Seed do Banco de Dados...");

  // ==========================================
  // 1. CONFIGURAÇÃO DO TENANT (IGREJA INICIAL)
  // ==========================================
  const churchSlug = "icb-nova-floresta"; // Slug da igreja padrão

  // Cria a primeira igreja caso ela não exista
  const church = await prisma.church.upsert({
    where: { slug: churchSlug },
    update: {},
    create: {
      name: "Igreja de Cristo no Brasil - Nova Floresta",
      slug: churchSlug,
    },
  });

  console.log(
    `⛪ Igreja de destaque configurada: ${church.name} (ID: ${church.id})`,
  );

  // ==========================================
  // 2. VÍNCULO MULTI-TENANT DOS DADOS ANTIGOS
  // ==========================================

  // Vincula membros que estão com churchId nulo
  const updatedMembers = await prisma.member.updateMany({
    where: { churchId: null },
    data: { churchId: church.id },
  });
  if (updatedMembers.count > 0) {
    console.log(
      `⚙️ ${updatedMembers.count} membros antigos foram vinculados a esta igreja.`,
    );
  }

  // Vincula eventos que estão com churchId nulo
  const updatedEvents = await prisma.event.updateMany({
    where: { churchId: null },
    data: { churchId: church.id },
  });
  if (updatedEvents.count > 0) {
    console.log(
      `⚙️ ${updatedEvents.count} eventos antigos foram vinculados a esta igreja.`,
    );
  }

  // ==========================================
  // 3. CRIAÇÃO DO ADMINISTRADOR INICIAL
  // ==========================================
  const adminName = process.env.INITIAL_ADMIN_NAME?.trim();
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      "Configure INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD antes de executar o seed.",
    );
  }

  if (adminPassword.length < 8) {
    throw new Error("INITIAL_ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");
  }

  const adminAlreadyExists = await prisma.member.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (adminAlreadyExists) {
    // Mesmo que o admin já exista, vamos garantir que ele tem uma igreja vinculada
    await prisma.member.updateMany({
      where: { email: adminEmail, churchId: null },
      data: { churchId: church.id },
    });

    console.log(
      "ℹ️ Administrador inicial já existe. Verificação de Tenant concluída.",
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 8);

  await prisma.member.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      mustChangePassword: true,
      role: "ADMIN",
      isSuperAdmin: true,
      isActive: true,
      churchId: church.id, // 🔑 O novo admin já nasce dentro da igreja padrão
    },
  });

  console.log(`👤 Administrador inicial criado com sucesso: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
