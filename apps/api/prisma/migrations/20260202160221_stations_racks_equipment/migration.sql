-- CreateEnum
CREATE TYPE "StationType" AS ENUM ('POP', 'ARMARIO', 'TORRE', 'SALA_TECNICA', 'OUTRO');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('OLT', 'DIO', 'SPLITTER', 'PATCH_PANEL', 'ODF', 'ONU', 'ROUTER', 'SWITCH', 'OUTRO');

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "StationType" NOT NULL DEFAULT 'POP',
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rack" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RackEquipment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "rackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "vendor" TEXT,
    "model" TEXT,
    "serial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RackEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Station_companyId_projectId_idx" ON "Station"("companyId", "projectId");

-- CreateIndex
CREATE INDEX "Rack_companyId_stationId_idx" ON "Rack"("companyId", "stationId");

-- CreateIndex
CREATE INDEX "RackEquipment_companyId_rackId_idx" ON "RackEquipment"("companyId", "rackId");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rack" ADD CONSTRAINT "Rack_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rack" ADD CONSTRAINT "Rack_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RackEquipment" ADD CONSTRAINT "RackEquipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RackEquipment" ADD CONSTRAINT "RackEquipment_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
