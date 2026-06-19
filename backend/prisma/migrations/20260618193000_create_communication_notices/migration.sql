-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('RASCUNHO', 'ENVIADO');

-- CreateTable
CREATE TABLE "communication_notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'APP',
    "status" "CommunicationStatus" NOT NULL DEFAULT 'ENVIADO',
    "churchId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communication_notices_churchId_idx" ON "communication_notices"("churchId");

-- CreateIndex
CREATE INDEX "communication_notices_createdById_idx" ON "communication_notices"("createdById");

-- AddForeignKey
ALTER TABLE "communication_notices" ADD CONSTRAINT "communication_notices_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_notices" ADD CONSTRAINT "communication_notices_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
