/*
  Warnings:

  - You are about to drop the column `specialty` on the `FieldTechnicianProfile` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TechnicianSpecialty" ADD VALUE 'FTTH';
ALTER TYPE "TechnicianSpecialty" ADD VALUE 'FUSIONISTA';

-- DropIndex
DROP INDEX "FieldTechnicianProfile_companyId_specialty_idx";

-- AlterTable
ALTER TABLE "FieldTechnicianProfile" DROP COLUMN "specialty",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "specialties" "TechnicianSpecialty"[] DEFAULT ARRAY[]::"TechnicianSpecialty"[],
ALTER COLUMN "cboCode" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "FieldTechnicianProfile_companyId_idx" ON "FieldTechnicianProfile"("companyId");
