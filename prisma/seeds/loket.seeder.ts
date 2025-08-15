import { PrismaClient } from '@prisma/client';

export class LoketSeeder {
  constructor(private prismaCient: PrismaClient) {}

  async seed() {
    const data = [
      {
        nama_loket: 'LOKET 1',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 2',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 2',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 3',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 4',
        outlet_id: 2,
      },
    ];

    await this.prismaCient.lokets.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeding loket (${data.length}) records`);
  }
}
