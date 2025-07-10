-- CreateTable
CREATE TABLE "Pasien" (
    "id" SERIAL NOT NULL,
    "nomor_antrian_id" INTEGER NOT NULL,
    "nomor_registrasi" VARCHAR(100) NOT NULL,
    "jenis_registrasi_id" INTEGER NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Pasien_pkey" PRIMARY KEY ("id")
);
