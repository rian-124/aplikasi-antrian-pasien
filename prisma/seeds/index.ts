import { PrismaClient } from '@prisma/client';
import { JenisRegistrasisSeeder } from './jenis-registrasis.seeder';

export class Seeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async run() {
    await new JenisRegistrasisSeeder(this.prisma).seed();
  }

  async close() {
    await this.prisma.$disconnect();
  }
}
