import { Penjamins } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { PenjaminsRequest } from 'src/model/penjamins.model';
import { ValidationRequestPenjamin } from './penjamins.validation';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePenjaminsDto } from './dtos/create-penjamins.dto';
import { UpdatePenjaminsDto } from './dtos/update-penjamins.dto';

@Injectable()
export class PenjaminsService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getAllPenjamins(): Promise<Penjamins[]> {
    const dataPenjamins = this.prismaService.penjamins.findMany();

    return dataPenjamins;
  }

  async getPenjaminsByJenisRegistrasi(request: string): Promise<Penjamins[]> {
    const jenisRegistrasi =
      await this.prismaService.jenisRegistrasis.findUnique({
        where: {
          jenis: request,
        },
      });

    if (!jenisRegistrasi) {
      throw new NotFoundException('Jenis registrasi not found');
    }

    const getPenjaminsByJenisRegistrasis =
      await this.prismaService.penjamins.findMany({
        where: {
          jenis_registrasi_id: jenisRegistrasi.id,
        },
      });

    return getPenjaminsByJenisRegistrasis;
  }

  async updatePenjamins(
    id: number,
    request: UpdatePenjaminsDto,
  ): Promise<Penjamins> {
    const jenisRegistrasi =
      await this.prismaService.jenisRegistrasis.findUnique({
        where: {
          id: request.jenis_registrasi_id,
        },
      });

    if (!jenisRegistrasi) {
      throw new NotFoundException(`Jenis registrasi not found`);
    }

    const penjamins = this.prismaService.penjamins.update({
      where: {
        id,
      },
      data: {
        nama: request.nama,
      },
    });

    return penjamins;
  }

  async createPenjamins(request: CreatePenjaminsDto): Promise<Penjamins> {
    const validationRequest: PenjaminsRequest =
      (await this.validationService.validate(
        ValidationRequestPenjamin.PENJAMINS,
        request,
      )) as PenjaminsRequest;

    const jenisRegistrasi =
      await this.prismaService.jenisRegistrasis.findUnique({
        where: {
          id: validationRequest.jenis_registrasi_id,
        },
      });

    if (!jenisRegistrasi) {
      throw new NotFoundException(`Jenis registrasi id not found`);
    }

    const penjamins = await this.prismaService.penjamins.count({
      where: {
        nama: validationRequest.nama,
      },
    });

    if (penjamins !== 0) {
      throw new HttpException('penjamins already exists', 400);
    }

    const createPenjamins = this.prismaService.penjamins.create({
      data: {
        nama: validationRequest.nama,
        jenis_registrasi_id: validationRequest.jenis_registrasi_id,
      },
    });

    return createPenjamins;
  }

  async deletePenjamins(id: number) {
    const penjamins = await this.prismaService.penjamins.findUnique({
      where: { id },
    });

    if (!penjamins) {
      throw new NotFoundException(`Penjamins id not found`);
    }

    const deletePenjamins = await this.prismaService.penjamins.delete({
      where: { id: penjamins.id },
    });

    return deletePenjamins;
  }
}
