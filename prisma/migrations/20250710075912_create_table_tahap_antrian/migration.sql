-- CreateTable
CREATE TABLE "TahapAntrian" (
    "id" SERIAL NOT NULL,
    "tahap" VARCHAR(100) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TahapAntrian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "antrian_pasiens" ADD CONSTRAINT "antrian_pasiens_tahap_antrian_id_fkey" FOREIGN KEY ("tahap_antrian_id") REFERENCES "TahapAntrian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
