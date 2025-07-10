/*
  Warnings:

  - You are about to drop the `Pasien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status_Registrasi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pasien" DROP CONSTRAINT "Pasien_status_registrasi_id_fkey";

-- DropTable
DROP TABLE "Pasien";

-- DropTable
DROP TABLE "Status_Registrasi";

-- CreateTable
CREATE TABLE "pasiens" (
    "id" SERIAL NOT NULL,
    "nomor_antrian_id" INTEGER NOT NULL,
    "nomor_registrasi" VARCHAR(100) NOT NULL,
    "jenis_registrasi_id" INTEGER NOT NULL,
    "status_registrasi_id" INTEGER NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pasiens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status_Registrasis" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Status_Registrasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_registrasis" (
    "id" SERIAL NOT NULL,
    "jenis" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "jenis_registrasis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_jenis_registrasi_id_fkey" FOREIGN KEY ("jenis_registrasi_id") REFERENCES "jenis_registrasis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_status_registrasi_id_fkey" FOREIGN KEY ("status_registrasi_id") REFERENCES "Status_Registrasis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
