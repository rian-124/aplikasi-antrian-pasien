import { PrismaService } from '../common/prisma.service';
import { Status } from '../model/pasiens.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WebSocketGateaway } from '../common/websocket.gateaway';
import { AntrianPasiens } from '@prisma/client';
import { AuthenticatedRequest } from 'src/model/user.model';
import { UpdateStatusAntrianDto } from './dtos/update-statusAntrian';
import {
  AntrianPasiensResponse,
  NomorAntrianPasienResponse,
  RecapAntrianPasienResponse,
} from 'src/model/antrianpasien.model';
import { getDayRangeWib } from 'src/utils/date.utils';
import { AntrianPasienRepository } from './antrian-pasien.repository';
import { mapDBtoModelAntrianPasiens } from 'src/utils/mapDBTomodel';

@Injectable()
export class AntrianPasienService {
  constructor(
    private prismaService: PrismaService,
    private wsGateaway: WebSocketGateaway,
    private antrianRepo: AntrianPasienRepository,
  ) {}

  async getAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiensResponse> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      where: {
        outlet_id: outlet.id,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: {
          select: {
            name: true,
          },
        },
        lokets: true,
        outlets: true,
      },
    });

    return {
      antrian_pasiens: mapDBtoModelAntrianPasiens(dataStatusAntrian),
    };
  }

  async getDailyAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiensResponse> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const { startOfDay, endOfDay } = getDayRangeWib();

    const result = await this.prismaService.antrianPasiens.findMany({
      where: {
        outlet_id: outlet.id,
        created_At: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: {
          select: {
            name: true,
          },
        },
        lokets: true,
        outlets: true,
      },
    });

    return {
      antrian_pasiens: mapDBtoModelAntrianPasiens(result),
    };
  }

  async getNomorAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<NomorAntrianPasienResponse[]> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const dataNomorAntrianPasien =
      await this.prismaService.antrianPasiens.findMany({
        where: {
          outlet_id: outlet.id,
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          nomor_Antrian: true,
          users: {
            select: {
              name: true,
            },
          },
          pasien: {
            select: {
              jenis_registrasis: {
                select: {
                  jenis: true,
                },
              },
            },
          },
          lokets: true,
        },
      });

    return dataNomorAntrianPasien;
  }

  async getDailyNomorAntriansService(
    req: AuthenticatedRequest,
  ): Promise<NomorAntrianPasienResponse[]> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const { startOfDay, endOfDay } = getDayRangeWib();

    const dataNomorAntrianPasien =
      await this.prismaService.antrianPasiens.findMany({
        where: {
          outlet_id: outlet.id,
          created_At: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          nomor_Antrian: true,
          users: {
            select: {
              name: true,
            },
          },
          pasien: {
            select: {
              jenis_registrasis: {
                select: {
                  jenis: true,
                },
              },
            },
          },
          lokets: true,
        },
      });

    return dataNomorAntrianPasien;
  }

  async searchStatusAntriansService(
    keyword: string,
  ): Promise<AntrianPasiens[]> {
    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      where: {
        OR: [
          {
            nomor_Antrian: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            pasien: {
              nomor_registrasi: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: true,
      },
    });

    if (dataStatusAntrian.length === 0) {
      throw new NotFoundException(`Data ${keyword} tidak ditemukan`);
    }

    this.wsGateaway.broadcastToAdminUsers(dataStatusAntrian);

    return dataStatusAntrian;
  }

  async updateStatusAntriansService(
    id: number,
    body: UpdateStatusAntrianDto,
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiens> {
    const statusAntrian = await this.prismaService.statusAntrians.findUnique({
      where: {
        status: body.status,
      },
    });

    if (!statusAntrian) {
      throw new NotFoundException(
        `Status antrian ${body.status} tidak ditemukan`,
      );
    }

    const antrianPasien = await this.prismaService.antrianPasiens.findUnique({
      where: { id },
      include: { status_antrian: true },
    });

    if (!antrianPasien) {
      throw new NotFoundException(
        `Antrian pasien dengan ID ${id} tidak ditemukan`,
      );
    }

    const currentStatus = antrianPasien.status_antrian.status as Status;
    let nextStatus = body.status;

    this.validateStatusChangeService(currentStatus, nextStatus);

    if (
      (nextStatus === Status.RECALL && antrianPasien.bintang >= 2) ||
      (nextStatus === Status.SKIPPED && antrianPasien.bintang >= 2)
    ) {
      nextStatus = Status.CANCELED;
      const newStatusAntrian =
        await this.prismaService.statusAntrians.findUnique({
          where: { status: nextStatus },
        });

      if (!newStatusAntrian) {
        throw new NotFoundException(
          `Status antrian ${nextStatus} tidak ditemukan`,
        );
      }

      statusAntrian.id = newStatusAntrian.id;
    }

    const incrementBintang =
      nextStatus === Status.RECALL || nextStatus === Status.SKIPPED
        ? antrianPasien.bintang + 1
        : antrianPasien.bintang;

    const users = await this.prismaService.users.findUnique({
      where: { id: req.user.sub },
    });

    if (!users) {
      throw new NotFoundException(`User id ${users} tidak di temukan`);
    }

    if (users.loket_id === null) {
      throw new BadRequestException(
        'Tidak dapat melakukan update status antrian user belum memiliki loket',
      );
    }

    const updatedAntrian = await this.prismaService.antrianPasiens.update({
      where: { id },
      data: {
        status_antrian_id: statusAntrian.id,
        bintang: incrementBintang,
        user_id: req.user.sub,
        loket_id: users.loket_id,
      },
      include: {
        pasien: true,
        users: {
          select: {
            name: true,
          },
        },
        outlets: true,
        lokets: true,
      },
    });

    this.wsGateaway.broadcastToAdminUsers(updatedAntrian);

    return updatedAntrian;
  }

  private validateStatusChangeService(
    currentStatus: Status,
    nextStatus: Status,
  ) {
    if (
      currentStatus === Status.WAITING &&
      (nextStatus === Status.CANCELED ||
        nextStatus === Status.RECALL ||
        nextStatus === Status.SKIPPED ||
        nextStatus === Status.COMPLETE)
    ) {
      throw new BadRequestException(
        `Tidak dapat mengubah dari WAITING ke ${nextStatus}. Harus CALL terlebih dahulu.`,
      );
    }

    if (
      (currentStatus === Status.CANCELED ||
        currentStatus === Status.COMPLETE) &&
      (nextStatus === Status.CALL ||
        nextStatus === Status.RECALL ||
        nextStatus === Status.WAITING ||
        nextStatus === Status.SKIPPED ||
        nextStatus === Status.COMPLETE ||
        nextStatus === Status.CANCELED)
    ) {
      throw new BadRequestException(
        `Tidak dapat mengubah dari ${currentStatus} ke ${nextStatus}, karena status sudah final.`,
      );
    }
  }

  async getUserAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiensResponse> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      where: {
        outlet_id: outlet.id,
        user_id: req.user.sub,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: {
          select: {
            name: true,
          },
        },
        lokets: true,
        outlets: true,
      },
    });

    return {
      antrian_pasiens: mapDBtoModelAntrianPasiens(dataStatusAntrian),
    };
  }

  async getDailyUserAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiensResponse> {
    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(
        'Outlet not found, unable to retrieve queue status.',
      );
    }

    const { startOfDay, endOfDay } = getDayRangeWib();

    const result = await this.prismaService.antrianPasiens.findMany({
      where: {
        outlet_id: outlet.id,
        user_id: req.user.sub,
        created_At: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: {
          select: {
            name: true,
          },
        },
        lokets: true,
        outlets: true,
      },
    });

    return {
      antrian_pasiens: mapDBtoModelAntrianPasiens(result),
    };
  }

  async getUserRecapAntrianPasiensService(
    req: AuthenticatedRequest,
  ): Promise<RecapAntrianPasienResponse> {
    const {
      perday: dataPerday,
      permonth: dataPermonth,
      peryear: dataPeryear,
    } = await this.antrianRepo.getRecapAntrianPasienRepository(req);

    const perday = dataPerday.map((d) => ({
      user_id: d.user_id,
      total: Number(d.total),
      perday: d.perday.toISOString().split('T')[0],
    }));

    const permonth = dataPermonth.map((d) => ({
      user_id: d.user_id,
      total: Number(d.total),
      permonth:
        d.permonth.getFullYear() + '-' + String(d.permonth.getMonth() + 1),
    }));

    const peryear = dataPeryear.map((d) => ({
      user_id: d.user_id,
      total: Number(d.total),
      peryear: String(d.peryear.getFullYear()),
    }));

    return {
      dataRecap: {
        perday,
        permonth,
        peryear,
      },
    };
  }
}
