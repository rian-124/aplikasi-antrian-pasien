/*
  Warnings:

  - You are about to drop the column `nomor_Antrian_id` on the `antrian_pasiens` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_antrian_id` on the `pasiens` table. All the data in the column will be lost.
  - You are about to drop the `nomor_antrians` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nomor_Antrian` to the `antrian_pasiens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pasien_id` to the `antrian_pasiens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nomor_antrians" DROP CONSTRAINT "nomor_antrians_status_antrians_id_fkey";

-- DropForeignKey
ALTER TABLE "nomor_antrians" DROP CONSTRAINT "nomor_antrians_tahap_antrian_id_fkey";

-- DropForeignKey
ALTER TABLE "pasiens" DROP CONSTRAINT "pasiens_nomor_antrian_id_fkey";

-- DropIndex
DROP INDEX "pasiens_nomor_antrian_id_key";

-- AlterTable
ALTER TABLE "antrian_pasiens" DROP COLUMN "nomor_Antrian_id",
ADD COLUMN     "nomor_Antrian" VARCHAR NOT NULL,
ADD COLUMN     "pasien_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pasiens" DROP COLUMN "nomor_antrian_id";

-- DropTable
DROP TABLE "nomor_antrians";

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasiens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
