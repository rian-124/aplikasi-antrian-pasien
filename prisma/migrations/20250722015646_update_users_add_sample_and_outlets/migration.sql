/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outlet_id` to the `antrian_pasiens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sample_id` to the `antrian_pasiens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `antrian_pasiens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "antrian_pasiens" ADD COLUMN     "outlet_id" INTEGER NOT NULL,
ADD COLUMN     "sample_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "email" VARCHAR NOT NULL,
ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "outlet_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Outlets" (
    "id" SERIAL NOT NULL,
    "nama_outlet" VARCHAR NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outlets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Samples" (
    "id" SERIAL NOT NULL,
    "name_sample" VARCHAR NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_t" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Samples_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "Outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "Samples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "Outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
