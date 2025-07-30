import { PrismaClient } from '@prisma/client';

export class PenjaminSeeder {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        nama: 'BPJS',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'KIS',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Asuransi Swasta',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Jamkesda',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'TNI/POLRI',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Perusahaan',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Kis',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Jasa Raharja',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Kartu Indonesia Sehat',
        jenis_registrasi_id: 2,
      },
      {
        nama: 'Bayar Langsung (Tunai)',
        jenis_registrasi_id: 1,
      },
      {
        nama: 'Transfer/Non-Tunai',
        jenis_registrasi_id: 1,
      },
      {
        nama: 'Pasien Umum Reguler',
        jenis_registrasi_id: 1,
      },
      {
        nama: 'Pasien Umum VIP',
        jenis_registrasi_id: 1,
      },
    ];

    await this.prismaClient.penjamins.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeding penjamins (${data.length}) records`);
  }
}
