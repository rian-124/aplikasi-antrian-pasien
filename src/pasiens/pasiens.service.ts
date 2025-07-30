import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  Jenis,
  PasiensRequest,
  PasiensRequestUpdate,
} from '../model/pasiens.model';
import {
  PasiensValidation,
  PasiensValidationUpdate,
} from './pasiens.validation';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';
import { Pasiens } from '@prisma/client';

@Injectable()
export class PasiensService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private wsGateAway: WebSocketGateaway,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async storePasiens(request: PasiensRequest): Promise<Pasiens> {
    const PasiensRequest: PasiensRequest = this.validationService.validate(
      PasiensValidation.JENIS,
      request,
    ) as PasiensRequest;

    const jenis = await this.prismaService.jenisRegistrasis.findUnique({
      where: {
        jenis: PasiensRequest.jenis,
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
        id: PasiensRequest.outlet_id,
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

    const prefix = request.jenis === Jenis.UMUM ? 'U' : 'J';

    const lastNomor = await this.prismaService.antrianPasiens.findFirst({
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

    const formattedNomor = prefix + String(nextNumber).padStart(5, '0');

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

  async updatePasiensPenjamins(
    id: number,
    request: PasiensRequestUpdate,
  ): Promise<Pasiens> {
    const validatedRequest: PasiensRequestUpdate =
      (await this.validationService.validate(
        PasiensValidationUpdate.PENJAMINSID,
        request,
      )) as PasiensRequestUpdate;

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
        id: validatedRequest.penjamin_id,
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
        penjamin_id: validatedRequest.penjamin_id,
      },
    });

    return updatePasiens;
  }
}
