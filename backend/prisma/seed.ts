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
    console.log("Administrador inicial ja existe. Seed ignorado.");
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
      isActive: true,
    },
  });

  console.log(`Administrador inicial criado: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
