/*
  Warnings:

  - You are about to drop the column `isActive` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "isActive";
