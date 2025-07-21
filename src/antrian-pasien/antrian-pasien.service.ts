import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { PasienStatusRequest, Status } from '../model/pasiens.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusPasienValidation } from '../pasiens/pasiens.validation';

@Injectable()
export class AntrianPasienService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getAllStatusAntrian() {
    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
      },
    });

    return {
      status: 200,
      message: 'Berhasil mengambil data antrian pasien',
      data: dataStatusAntrian,
    };
  }

  async updateStatusAntrian(request: PasienStatusRequest) {
    const PasienStatusRequest: PasienStatusRequest =
      this.validationService.validate(
        StatusPasienValidation.STATUS,
        request,
      ) as PasienStatusRequest;

    const statusAntrian = await this.prismaService.statusAntrians.findUnique({
      where: {
        status: PasienStatusRequest.status,
      },
    });

    if (!statusAntrian) {
      throw new NotFoundException(
        `Tidak ada status antrian ${statusAntrian} dalam daftar`,
      );
    }

    const antrianPasien = await this.prismaService.antrianPasiens.findUnique({
      where: {
        id: PasienStatusRequest.antrian_id,
      },
      include: {
        status_antrian: true,
      },
    });

    if (!antrianPasien) {
      throw new NotFoundException(
        `Tidak ada antrian pasien dengan id ${antrianPasien}`,
      );
    }

    const currentStatus = antrianPasien.status_antrian.status as Status;

    if (
      currentStatus === Status.WAITING &&
      (PasienStatusRequest.status === Status.CANCELED ||
        PasienStatusRequest.status === Status.COMPLETE)
    ) {
      throw new Error(
        `Tidak bisa mengubah dari waiting ke ${PasienStatusRequest.status} Call terlebih dahulu`,
      );
    }

    const antrianPasienUpdate = await this.prismaService.antrianPasiens.update({
      where: {
        id: PasienStatusRequest.antrian_id,
      },
      data: {
        status_antrian_id: statusAntrian.id,
      },
      include: {
        pasien: true,
      },
    });

    return {
      status: 200,
      message: 'Berhasil merubah status antrian pasien',
      data: antrianPasienUpdate,
    };
  }
}
