/*
  Warnings:

  - You are about to drop the `Status_Registrasis` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nomor_antrian_id]` on the table `pasiens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "pasiens" DROP CONSTRAINT "pasiens_status_registrasi_id_fkey";

-- DropTable
DROP TABLE "Status_Registrasis";

-- CreateTable
CREATE TABLE "status_registrasis" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "status_registrasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nomor_antrians" (
    "id" SERIAL NOT NULL,
    "nomor" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "nomor_antrians_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nomor_antrians_nomor_key" ON "nomor_antrians"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "pasiens_nomor_antrian_id_key" ON "pasiens"("nomor_antrian_id");

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_nomor_antrian_id_fkey" FOREIGN KEY ("nomor_antrian_id") REFERENCES "nomor_antrians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_status_registrasi_id_fkey" FOREIGN KEY ("status_registrasi_id") REFERENCES "status_registrasis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
