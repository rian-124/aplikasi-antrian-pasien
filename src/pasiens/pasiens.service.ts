import { PrismaService } from '../common/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Jenis } from '../model/pasiens.model';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';
import { Pasiens } from '@prisma/client';
import { UpdatePasiensDto } from './dtos/update-pasiens.dto';
import { CreatePasiensDto } from './dtos/create-pasiens.dto';
import { AuthenticatedRequest } from 'src/model/user.model';

@Injectable()
export class PasiensService {
  constructor(
    private prismaService: PrismaService,
    private wsGateAway: WebSocketGateaway,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async storePasienService(
    body: CreatePasiensDto,
    req: AuthenticatedRequest,
  ): Promise<Pasiens> {
    const jenis = await this.prismaService.jenisRegistrasis.findUnique({
      where: {
        jenis: body.jenis,
      },
    });

    if (!jenis) {
      throw new NotFoundException(`Jenis registrasi ${jenis} tidak ditemukan`);
    }

    const status = await this.prismaService.statusAntrians.findUnique({
      where: {
        status: 'WAITING',
      },
    });

    if (!status) {
      throw new NotFoundException(
        `Status registrasi ${status} tidak ditemukan`,
      );
    }

    const outlet = await this.prismaService.outlets.findUnique({
      where: {
        nama_outlet: req.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException(`Outlet ${outlet} tidak di temukan`);
    }

    const tahap = await this.prismaService.tahapAntrians.findUnique({
      where: {
        tahap: 'LOKET',
      },
    });

    if (!tahap) {
      throw new NotFoundException(`Tahap registrasi ${tahap} tidak ditemukan`);
    }

    const prefix = body.jenis === Jenis.UMUM ? 'U' : 'J';

    const lastNomor = await this.prismaService.antrianPasiens.findFirst({
      where: {
        outlet_id: outlet.id,
        nomor_Antrian: {
          startsWith: prefix,
        },
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        nomor_Antrian: true,
      },
    });

    let nextNumber = 1;
    if (lastNomor && lastNomor.nomor_Antrian) {
      const numericPart = String(lastNomor.nomor_Antrian).replace(/\D/g, '');
      nextNumber = parseInt(numericPart, 10) + 1;
    }

    const formattedNomor = prefix + String(nextNumber).padStart(3, '0');

    const pasien = await this.prismaService.pasiens.create({
      data: {
        nomor_registrasi: 'REG' + Date.now(),
        sample_id: 1,
        jenis_registrasi_id: jenis.id,
        status_registrasi_id: 1,
        AntrianPasiens: {
          create: {
            tahap_antrian_id: tahap.id,
            status_antrian_id: status.id,
            outlet_id: outlet.id,
            nomor_Antrian: formattedNomor,
          },
        },
      },
      include: {
        AntrianPasiens: true,
      },
    });

    this.wsGateAway.broadcastToAdminUsers(pasien);
    return pasien;
  }

  async updatePasienByPenjaminService(
    id: number,
    body: UpdatePasiensDto,
  ): Promise<Pasiens> {
    const pasiens = await this.prismaService.pasiens.findUnique({
      where: {
        id,
      },
      include: {
        jenis_registrasis: true,
      },
    });

    if (!pasiens) {
      throw new NotFoundException(`pasiens id ${id} not found`);
    }

    const penjamins = await this.prismaService.penjamins.findUnique({
      where: {
        id: body.penjamin_id,
      },
      include: {
        jenis_registrasi: true,
      },
    });

    if (!penjamins) {
      throw new NotFoundException(`Penjamins id not found`);
    }

    if (penjamins.jenis_registrasi_id !== pasiens.jenis_registrasi_id) {
      throw new BadRequestException(
        `Jenis registrasi dari penjamin (${penjamins.jenis_registrasi.jenis}) tidak sesuai dengan jenis registrasi pasien (${pasiens.jenis_registrasis.jenis})`,
      );
    }

    const updatePasiens = this.prismaService.pasiens.update({
      where: {
        id: id,
      },
      data: {
        penjamin_id: body.penjamin_id,
      },
    });

    return updatePasiens;
  }
}
