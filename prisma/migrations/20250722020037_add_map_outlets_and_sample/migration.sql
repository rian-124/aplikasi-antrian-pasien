/*
  Warnings:

  - You are about to drop the `Outlets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Samples` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "antrian_pasiens" DROP CONSTRAINT "antrian_pasiens_outlet_id_fkey";

-- DropForeignKey
ALTER TABLE "antrian_pasiens" DROP CONSTRAINT "antrian_pasiens_sample_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_outlet_id_fkey";

-- DropTable
DROP TABLE "Outlets";

-- DropTable
DROP TABLE "Samples";

-- CreateTable
CREATE TABLE "outlets" (
    "id" SERIAL NOT NULL,
    "nama_outlet" VARCHAR NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "samples" (
    "id" SERIAL NOT NULL,
    "name_sample" VARCHAR NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_t" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
