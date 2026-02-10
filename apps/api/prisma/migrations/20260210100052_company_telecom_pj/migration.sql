-- CreateEnum
CREATE TYPE "CompanyOperationType" AS ENUM ('FTTH', 'BACKBONE', 'DATACENTER');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "razaoSocial" TEXT,
ADD COLUMN     "registroProfissional" TEXT,
ADD COLUMN     "responsavelTecnico" TEXT;

-- CreateTable
CREATE TABLE "CompanyOperation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" "CompanyOperationType" NOT NULL,

    CONSTRAINT "CompanyOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyOperation_companyId_type_key" ON "CompanyOperation"("companyId", "type");

-- AddForeignKey
ALTER TABLE "CompanyOperation" ADD CONSTRAINT "CompanyOperation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
