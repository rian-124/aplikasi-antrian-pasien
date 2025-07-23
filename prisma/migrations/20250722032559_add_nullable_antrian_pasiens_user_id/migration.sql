-- DropForeignKey
ALTER TABLE "antrian_pasiens" DROP CONSTRAINT "antrian_pasiens_user_id_fkey";

-- AlterTable
ALTER TABLE "antrian_pasiens" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
