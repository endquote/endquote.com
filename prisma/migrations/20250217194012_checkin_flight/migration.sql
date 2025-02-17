/*
  Warnings:

  - A unique constraint covering the columns `[flightId]` on the table `checkin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "checkin" ADD COLUMN     "flightId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "checkin_flightId_key" ON "checkin"("flightId");

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flight"("eqId") ON DELETE SET NULL ON UPDATE CASCADE;
