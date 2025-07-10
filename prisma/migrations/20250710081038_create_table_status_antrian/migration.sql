/*
  Warnings:

  - You are about to drop the `TahapAntrian` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "antrian_pasiens" DROP CONSTRAINT "antrian_pasiens_tahap_antrian_id_fkey";

-- DropTable
DROP TABLE "TahapAntrian";

-- CreateTable
CREATE TABLE "tahap_antrians" (
    "id" SERIAL NOT NULL,
    "tahap" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tahap_antrians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_antrians" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_antrians_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_status_antrian_id_fkey" FOREIGN KEY ("status_antrian_id") REFERENCES "status_antrians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_tahap_antrian_id_fkey" FOREIGN KEY ("tahap_antrian_id") REFERENCES "tahap_antrians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
