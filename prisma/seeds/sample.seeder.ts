import { PrismaClient } from '@prisma/client';

export class SampleSeeder {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        name_sample: 'IPRJT',
      },
    ];

    await this.prismaClient.samples.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeding samples (${data.length}) records`);
  }
}
