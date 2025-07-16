/*
  Warnings:

  - A unique constraint covering the columns `[jenis]` on the table `jenis_registrasis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jenis_registrasis_jenis_key" ON "jenis_registrasis"("jenis");
