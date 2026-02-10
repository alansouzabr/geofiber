/*
  Warnings:

  - A unique constraint covering the columns `[companyId,key]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Permission_key_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_companyId_key_key" ON "Permission"("companyId", "key");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
