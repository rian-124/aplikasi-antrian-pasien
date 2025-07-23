/*
  Warnings:

  - You are about to drop the column `sample_id` on the `antrian_pasiens` table. All the data in the column will be lost.
  - Added the required column `sample_id` to the `pasiens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "antrian_pasiens" DROP CONSTRAINT "antrian_pasiens_sample_id_fkey";

-- AlterTable
ALTER TABLE "antrian_pasiens" DROP COLUMN "sample_id";

-- AlterTable
ALTER TABLE "pasiens" ADD COLUMN     "sample_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
