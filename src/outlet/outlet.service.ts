import { PrismaService } from '../common/prisma.service';

export class OutletService {
  constructor(private prismaService: PrismaService) {}

  async getAllOutlets() {
    const dataAllOutlets = await this.prismaService.outlets.findMany();

    return {
      status: 200,
      message: 'Berhasil mengambil data outlets',
      data: dataAllOutlets,
    };
  }
}
