/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `status_registrasis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "status_registrasis_status_key" ON "status_registrasis"("status");
