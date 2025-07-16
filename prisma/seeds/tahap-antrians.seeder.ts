import { PrismaClient } from '@prisma/client';

export class TahapAntrian {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        tahap: 'Loket',
      },
      {
        tahap: 'Meja',
      },
    ];

    await this.prismaClient.tahapAntrians.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded jenis_registrasis (${data.length} records)`);
  }
}
