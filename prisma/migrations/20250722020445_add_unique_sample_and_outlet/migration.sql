/*
  Warnings:

  - A unique constraint covering the columns `[nama_outlet]` on the table `outlets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_sample]` on the table `samples` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "outlets_nama_outlet_key" ON "outlets"("nama_outlet");

-- CreateIndex
CREATE UNIQUE INDEX "samples_name_sample_key" ON "samples"("name_sample");
