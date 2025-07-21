import { PrismaClient } from '@prisma/client';

export class StatusRegistrasis {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    const data = [
      {
        status: 'LAMA',
      },
      {
        status: 'BARU',
      },
      {
        status: 'RUJUKAN',
      },
    ];

    await this.prisma.statusRegistrasis.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded status_registrasis (${data.length} records)`);
  }
}
