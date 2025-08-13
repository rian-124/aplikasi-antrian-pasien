import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  constructor(private prismaClient: PrismaClient) {}

  async seed() {
    const rawData = [
      {
        username: 'arifin123',
        name: 'arifin',
        password: '123456',
        outlet_id: 1,
        role_id: 1,
      },
      {
        username: 'afrian123',
        name: 'afrian',
        password: '123456',
        outlet_id: 2,
        role_id: 2,
      },
    ];

    const data = await Promise.all(
      rawData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    await this.prismaClient.users.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`Seeded users (${rawData.length}) records`);
  }
}
