import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export class PasiensService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async storePasiens(request: { jenis: 'JAMINAN' | 'UMUM' }) {
    const jenis = await this.prismaService.jenisRegistrasis.findUnique({
      where: {
        jenis: request.jenis,
      },
    });

    if (!jenis) {
      throw new NotFoundException(`Jenis registrasi ${jenis} tidak ditemukan`);
    }

    const status = await this.prismaService.statusAntrians.findUnique({
      where: {
        status: 'Waiting',
      },
    });

    if (!status) {
      throw new NotFoundException(
        `Status registrasi ${status} tidak ditemukan`,
      );
    }

    const tahap = await this.prismaService.tahapAntrians.findUnique({
      where: {
        tahap: 'Loket',
      },
    });

    if (!tahap) {
      throw new NotFoundException(`Tahap registrasi ${tahap} tidak ditemukan`);
    }

    const prefix = request.jenis === 'UMUM' ? 'U' : 'J';

    const lastNomor = await this.prismaService.nomorAntrians.findFirst({
      orderBy: {
        id: 'desc',
      },
      select: {
        nomor: true,
      },
    });

    let nextNumber = 1;
    if (lastNomor && lastNomor.nomor) {
      const numericPart = lastNomor.nomor.replace(/\D/g, '');
      nextNumber = parseInt(numericPart, 10) + 1;
    }

    const formattedNomor = prefix + String(nextNumber).padStart(5, '0');

    const nomorAntrian = await this.prismaService.nomorAntrians.create({
      data: {
        nomor: formattedNomor,
        status_antrians_id: status.id,
        tahap_antrian_id: tahap.id,
      },
    });

    const pasien = await this.prismaService.pasiens.create({
      data: {
        nomor_antrian_id: nomorAntrian.id,
        nomor_registrasi: 'REG' + Date.now(),
        jenis_registrasi_id: jenis.id,
        status_registrasi_id: 1,
      },
      include: {
        nomor_antrian: true,
      },
    });

    return pasien;
  }
}
