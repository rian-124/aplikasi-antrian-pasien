import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async resetDatabase() {
    await this.prismaService.$executeRawUnsafe(`
      TRUNCATE TABLE
      users,
      roles
      RESTART IDENTITY CASCADE;
      `);
  }
}
