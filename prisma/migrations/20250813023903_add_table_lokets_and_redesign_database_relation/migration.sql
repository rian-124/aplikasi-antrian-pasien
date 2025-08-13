/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loket_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "antrian_pasiens" ADD COLUMN     "loket_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ADD COLUMN     "loket_id" INTEGER,
ADD COLUMN     "username" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "Lokets" (
    "id" SERIAL NOT NULL,
    "nama_loket" VARCHAR NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lokets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lokets_nama_loket_key" ON "Lokets"("nama_loket");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_loket_id_key" ON "users"("loket_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_loket_id_fkey" FOREIGN KEY ("loket_id") REFERENCES "Lokets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lokets" ADD CONSTRAINT "Lokets_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_loket_id_fkey" FOREIGN KEY ("loket_id") REFERENCES "Lokets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
