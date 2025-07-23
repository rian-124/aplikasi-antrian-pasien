import { PrismaClient } from '@prisma/client';

export class OutletSeeder {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        nama_outlet: 'IPRJT',
      },
      {
        nama_outlet: 'GEDUNG A',
      },
    ];

    await this.prismaClient.outlets.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeding outlet (${data.length}) records`);
  }
}
