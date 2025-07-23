import { Prisma } from '@prisma/client';

export type Jenis = {
  jenis: 'JAMINAN' | 'UMUM';
};

export type PasienWithNomor = Prisma.PasiensGetPayload<{
  include: {
    AntrianPasiens;
  };
}>;

export type AntrianPasien = Prisma.AntrianPasiensGetPayload<{
  include: {
    pasien;
  };
}>;

export type AntrianPasienGet = Prisma.AntrianPasiensGetPayload<{
  include: {
    pasien;
    status_antrian;
    tahap_antrian;
  };
}>;

// export type UsersGetAll = Prisma.UsersGetPayload<>;
