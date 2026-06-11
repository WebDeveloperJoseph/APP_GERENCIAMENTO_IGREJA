import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

async function main() {
    const adminEmail = "admin@igreja.com";
    const adminPassword = "123456";

    const adminAlreadyExists = await prisma.member.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (adminAlreadyExists) {
        console.log("Admin já existe. Seed ignorado.");
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 8);

    await prisma.member.create({
        data: {
            name: "Administrador",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            isActive: true
        }
    });

    console.log("Admin criado com sucesso!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Senha: ${adminPassword}`);
}

main()
    .catch((error) => {
        console.error("Erro ao executar seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });