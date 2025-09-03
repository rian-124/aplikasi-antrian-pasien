import { PrismaClient } from '@prisma/client';

export class LoketSeeder {
  constructor(private prismaCient: PrismaClient) {}

  async seed() {
    const data = [
      {
        nama_loket: 'LOKET 5',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 6',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 7',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 8',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 9',
        outlet_id: 2,
      },
      {
        nama_loket: 'LOKET 10',
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
