-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ATIVO', 'MANUTENCAO', 'BAIXADO');

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "acquisitionDate" TIMESTAMP(3),
    "location" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);
