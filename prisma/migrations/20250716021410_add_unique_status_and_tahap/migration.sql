/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `status_antrians` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tahap]` on the table `tahap_antrians` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "status_antrians_status_key" ON "status_antrians"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tahap_antrians_tahap_key" ON "tahap_antrians"("tahap");
