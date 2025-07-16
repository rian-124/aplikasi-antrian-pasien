import { PrismaClient } from '@prisma/client';

export class StatusRegistrasis {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    const data = [
      {
        status: 'Lama',
      },
      {
        status: 'Baru',
      },
      {
        status: 'Rujukan',
      },
    ];

    await this.prisma.statusRegistrais.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded status_registrasis (${data.length} records)`);
  }
}
