-- CreateEnum
CREATE TYPE "SignalMode" AS ENUM ('STATIC', 'RANDOM_WALK');

-- CreateTable
CREATE TABLE "FiberSignal" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "rackEquipmentId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "mode" "SignalMode" NOT NULL DEFAULT 'RANDOM_WALK',
    "targetTxDbm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetRxDbm" DOUBLE PRECISION NOT NULL DEFAULT -20,
    "attenuationDb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "noiseDb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "steps" INTEGER NOT NULL DEFAULT 20,
    "txDbm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rxDbm" DOUBLE PRECISION NOT NULL DEFAULT -20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiberSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiberSignal_rackEquipmentId_key" ON "FiberSignal"("rackEquipmentId");

-- CreateIndex
CREATE INDEX "FiberSignal_companyId_idx" ON "FiberSignal"("companyId");

-- AddForeignKey
ALTER TABLE "FiberSignal" ADD CONSTRAINT "FiberSignal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiberSignal" ADD CONSTRAINT "FiberSignal_rackEquipmentId_fkey" FOREIGN KEY ("rackEquipmentId") REFERENCES "RackEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
