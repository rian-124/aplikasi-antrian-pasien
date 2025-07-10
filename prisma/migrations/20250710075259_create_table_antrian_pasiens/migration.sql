-- CreateTable
CREATE TABLE "antrian_pasiens" (
    "id" SERIAL NOT NULL,
    "nomor_Antrian_id" INTEGER NOT NULL,
    "tahap_antrian_id" INTEGER NOT NULL,
    "status_antrian_id" INTEGER NOT NULL,
    "created_At" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "antrian_pasiens_pkey" PRIMARY KEY ("id")
);
