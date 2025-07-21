/*
  Warnings:

  - Changed the type of `nomor_Antrian` on the `antrian_pasiens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "antrian_pasiens" DROP COLUMN "nomor_Antrian",
ADD COLUMN     "nomor_Antrian" INTEGER NOT NULL;
