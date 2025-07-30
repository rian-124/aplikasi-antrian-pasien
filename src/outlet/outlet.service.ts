import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { OutletsRequest } from '../model/outlets.model';
import { ValidationService } from 'src/common/validation.service';
import { OutletsValidation } from './outlet.validation';
import { Outlets } from '@prisma/client';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';

@Injectable()
export class OutletService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private wsGateaway: WebSocketGateaway,
  ) {}

  async getAllOutlets(): Promise<Outlets[]> {
    const dataAllOutlets = await this.prismaService.outlets.findMany();

    return dataAllOutlets;
  }

  async storeOutlets(request: OutletsRequest) {
    const validationRequest: OutletsRequest =
      (await this.validationService.validate(
        OutletsValidation.OUTLETS,
        request,
      )) as OutletsRequest;

    const dataOutletsWithSameName = await this.prismaService.outlets.count({
      where: {
        nama_outlet: validationRequest.nama_outlet,
      },
    });

    if (dataOutletsWithSameName !== 0) {
      throw new HttpException(`Data outlets sudah ada`, 400);
    }

    const addOutlets = await this.prismaService.outlets.create({
      data: {
        nama_outlet: validationRequest.nama_outlet,
      },
    });

    this.wsGateaway.broadcastToAdmin(addOutlets);

    return addOutlets;
  }

  async updateOutlets(id: number, request: OutletsRequest) {
    const validationRequest: OutletsRequest = this.validationService.validate(
      OutletsValidation.OUTLETS,
      request,
    ) as OutletsRequest;

    const dataOutlets = await this.prismaService.outlets.findUnique({
      where: { id },
    });

    if (!dataOutlets) {
      throw new NotFoundException(
        `Outlet dengan id ${dataOutlets} tidak di temukan`,
      );
    }

    const dataOutletsWithSameName = await this.prismaService.outlets.count({
      where: {
        nama_outlet: validationRequest.nama_outlet,
      },
    });

    if (dataOutletsWithSameName !== 0) {
      throw new HttpException(
        `Outlets ${request.nama_outlet} tidak di temukan`,
        400,
      );
    }

    const updateOutlets = await this.prismaService.outlets.update({
      where: { id },
      data: {
        nama_outlet: validationRequest.nama_outlet,
      },
    });

    this.wsGateaway.broadcastToAdminUsers(updateOutlets);

    return updateOutlets;
  }

  async deleteOutlets(id: number) {
    const dataOutlets = await this.prismaService.outlets.findUnique({
      where: { id },
    });

    if (!dataOutlets) {
      throw new NotFoundException(`Tidak dapat menemukan id ${id} roles`);
    }

    const deleteOutlets = await this.prismaService.outlets.delete({
      where: { id },
    });

    this.wsGateaway.broadcastToAdminUsers(deleteOutlets);

    return deleteOutlets;
  }
}
