import { PrismaClient } from '@prisma/client';

export class StatusAntrian {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        status: 'Waiting',
      },
      {
        status: 'Call',
      },
      {
        status: 'Complete',
      },
    ];

    await this.prismaClient.statusAntrians.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded jenis_registrasis (${data.length} records)`);
  }
}
