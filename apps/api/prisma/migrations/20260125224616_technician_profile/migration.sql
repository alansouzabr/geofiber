-- CreateEnum
CREATE TYPE "TechnicianSpecialty" AS ENUM ('REDE', 'TELEFONIA', 'TRANSMISSAO');

-- CreateTable
CREATE TABLE "FieldTechnicianProfile" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cboCode" TEXT NOT NULL,
    "specialty" "TechnicianSpecialty" NOT NULL,
    "registration" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "city" TEXT,
    "state" TEXT,
    "skills" JSONB,
    "certifications" JSONB,
    "tools" JSONB,
    "vehicle" JSONB,
    "availability" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldTechnicianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldTechnicianProfile_userId_key" ON "FieldTechnicianProfile"("userId");

-- CreateIndex
CREATE INDEX "FieldTechnicianProfile_companyId_specialty_idx" ON "FieldTechnicianProfile"("companyId", "specialty");

-- AddForeignKey
ALTER TABLE "FieldTechnicianProfile" ADD CONSTRAINT "FieldTechnicianProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldTechnicianProfile" ADD CONSTRAINT "FieldTechnicianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
