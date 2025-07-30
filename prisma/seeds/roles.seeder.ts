import { PrismaClient } from '@prisma/client';

export class RolesSeeder {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const data = [
      {
        name: 'ADMIN',
      },
      {
        name: 'ADMINUSERS',
      },
    ];

    await this.prismaClient.roles.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeding roles (${data.length}) records`);
  }
}
