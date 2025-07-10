/*
  Warnings:

  - Added the required column `status_registrasi_id` to the `Pasien` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pasien" ADD COLUMN     "status_registrasi_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Status_Registrasi" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Status_Registrasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pasien" ADD CONSTRAINT "Pasien_status_registrasi_id_fkey" FOREIGN KEY ("status_registrasi_id") REFERENCES "Status_Registrasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
