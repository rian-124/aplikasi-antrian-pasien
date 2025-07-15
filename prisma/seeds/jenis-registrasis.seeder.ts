import { PrismaClient } from '@prisma/client';

export class JenisRegistrasisSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    const data = [
      {
        jenis: 'UMUM',
      },
      {
        jenis: 'JAMINAN',
      },
    ];

    await this.prisma.jenisRegistrasis.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded jenis_registrasis (${data.length} records)`);
  }
}
