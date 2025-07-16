import { Prisma } from '@prisma/client';

export type Jenis = {
  jenis: 'JAMINAN' | 'UMUM';
};

export type PasienWithNomor = Prisma.PasiensGetPayload<{
  include: {
    nomor_antrian: true;
  };
}>;
