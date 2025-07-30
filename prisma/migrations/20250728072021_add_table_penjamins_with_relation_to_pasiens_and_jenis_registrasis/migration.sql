-- AlterTable
ALTER TABLE "pasiens" ADD COLUMN     "penjamin_id" INTEGER;

-- CreateTable
CREATE TABLE "penjamins" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jenis_registrasi_id" INTEGER NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "penjamins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "penjamins_nama_key" ON "penjamins"("nama");

-- AddForeignKey
ALTER TABLE "pasiens" ADD CONSTRAINT "pasiens_penjamin_id_fkey" FOREIGN KEY ("penjamin_id") REFERENCES "penjamins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penjamins" ADD CONSTRAINT "penjamins_jenis_registrasi_id_fkey" FOREIGN KEY ("jenis_registrasi_id") REFERENCES "jenis_registrasis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
