import { PrismaService } from '../common/prisma.service';
import { Status } from '../model/pasiens.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { WebSocketGateaway } from '../common/websocket.gateaway';
import { AntrianPasiens } from '@prisma/client';
import { AuthenticatedRequest } from 'src/model/user.model';
import { UpdateStatusAntrianDto } from './dtos/update-statusAntrian';

@Injectable()
export class AntrianPasienService {
  constructor(
    private prismaService: PrismaService,
    private wsGateaway: WebSocketGateaway,
  ) {}

  async getAllStatusAntrian(): Promise<AntrianPasiens[]> {
    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        tahap_antrian: true,
        status_antrian: true,
        pasien: true,
        users: true,
      },
    });

    return dataStatusAntrian;
  }

  async searchStatusAntrian(keyword: string): Promise<AntrianPasiens[]> {
    const dataStatusAntrian = await this.prismaService.antrianPasiens.findMany({
      where: {
        nomor_Antrian: {
          contains: keyword,
          mode: 'insensitive',
        },
        OR: [
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

    if (!dataStatusAntrian) {
      throw new NotFoundException(`Data ${keyword} tidak ditemukan`);
    }

    this.wsGateaway.broadcastToAdminUsers(dataStatusAntrian);

    return dataStatusAntrian;
  }

  async updateStatusAntrian(
    id: number,
    request: UpdateStatusAntrianDto,
    req: AuthenticatedRequest,
  ): Promise<AntrianPasiens> {
    const statusAntrian = await this.prismaService.statusAntrians.findUnique({
      where: {
        status: request.status,
      },
    });

    if (!statusAntrian) {
      throw new NotFoundException(
        `Status antrian ${request.status} tidak ditemukan`,
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
    let nextStatus = request.status;

    if (nextStatus === Status.CALL && antrianPasien.bintang >= 3) {
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
      nextStatus === Status.CALL
        ? antrianPasien.bintang + 1
        : antrianPasien.bintang;

    if (
      currentStatus === Status.WAITING &&
      (nextStatus === Status.CANCELED || nextStatus === Status.COMPLETE)
    ) {
      throw new Error(
        `Tidak dapat mengubah dari WAITING ke ${nextStatus}. Harus CALL terlebih dahulu.`,
      );
    }

    const users = await this.prismaService.users.findUnique({
      where: { id: req.user.sub },
    });

    if (!users) {
      throw new NotFoundException(`User id ${users} tidak di temukan`);
    }

    const updatedAntrian = await this.prismaService.antrianPasiens.update({
      where: { id },
      data: {
        status_antrian_id: statusAntrian.id,
        bintang: incrementBintang,
        user_id: req.user.sub,
      },
      include: {
        pasien: true,
        users: true,
      },
    });

    this.wsGateaway.broadcastToAdminUsers(updatedAntrian);

    return updatedAntrian;
  }
}
