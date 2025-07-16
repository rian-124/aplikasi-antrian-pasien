/*
  Warnings:

  - Added the required column `status_antrians_id` to the `nomor_antrians` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahap_antrian_id` to the `nomor_antrians` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nomor_antrians" ADD COLUMN     "status_antrians_id" INTEGER NOT NULL,
ADD COLUMN     "tahap_antrian_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "nomor_antrians" ADD CONSTRAINT "nomor_antrians_tahap_antrian_id_fkey" FOREIGN KEY ("tahap_antrian_id") REFERENCES "tahap_antrians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomor_antrians" ADD CONSTRAINT "nomor_antrians_status_antrians_id_fkey" FOREIGN KEY ("status_antrians_id") REFERENCES "status_antrians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
