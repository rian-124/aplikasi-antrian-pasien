import { PrismaClient } from '@prisma/client';
import { JenisRegistrasisSeeder } from './jenis-registrasis.seeder';
import { StatusRegistrasis } from './status-registrasis.seeder';
import { StatusAntrian } from './status-antrian.seeder';
import { TahapAntrian } from './tahap-antrians.seeder';
import { OutletSeeder } from './outlet.seeder';
import { SampleSeeder } from './sample.seeder';
import { PenjaminSeeder } from './penjamin.seeder';
import { RolesSeeder } from './roles.seeder';
import { UserSeeder } from './user.seeder';
import { LoketSeeder } from './loket.seeder';

export class Seeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async run() {
    await new JenisRegistrasisSeeder(this.prisma).seed();
    await new StatusRegistrasis(this.prisma).seed();
    await new StatusAntrian(this.prisma).seed();
    await new TahapAntrian(this.prisma).seed();
    await new OutletSeeder(this.prisma).seed();
    await new SampleSeeder(this.prisma).seed();
    await new PenjaminSeeder(this.prisma).seed();
    await new RolesSeeder(this.prisma).seed();
    await new LoketSeeder(this.prisma).seed();
    await new UserSeeder(this.prisma).seed();
  }

  async close() {
    await this.prisma.$disconnect();
  }
}
