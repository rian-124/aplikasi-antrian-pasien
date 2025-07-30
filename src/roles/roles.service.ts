import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RolesRequest, RolesResponse } from 'src/model/roles.model';
import { RolesValidation } from './roles.validation';
import { Roles } from '@prisma/client';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';

@Injectable()
export class RolesService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private wsGateaway: WebSocketGateaway,
    private prismaService: PrismaService,
  ) {}

  async getAllRole(): Promise<Roles[]> {
    const dataRole = await this.prismaService.roles.findMany();

    return dataRole;
  }

  async createRoles(request: RolesRequest): Promise<RolesResponse> {
    this.logger.info(`Add new roles ${request.name}`);

    const RolesRequest: RolesRequest = this.validationService.validate(
      RolesValidation.STOREROLES,
      request,
    ) as RolesRequest;

    const totalRolesWithSameRoles = await this.prismaService.roles.count({
      where: {
        name: RolesRequest.name,
      },
    });

    if (totalRolesWithSameRoles !== 0) {
      throw new HttpException('Roles already exists', 400);
    }

    const roles = await this.prismaService.roles.create({
      data: {
        name: RolesRequest.name,
      },
    });

    this.wsGateaway.broadcastToAdmin(roles);

    return {
      name: roles.name,
    };
  }

  async updateRoles(id: number, request: RolesRequest): Promise<Roles> {
    const validationRequest: RolesRequest = this.validationService.validate(
      RolesValidation.STOREROLES,
      request,
    ) as RolesRequest;

    const rolesData = await this.prismaService.roles.findUnique({
      where: { id },
    });

    if (!rolesData) {
      throw new NotFoundException(
        `Role dengan id ${rolesData} tidak ditemukan`,
      );
    }

    const totalRolesWithSameRoles = await this.prismaService.roles.count({
      where: {
        name: validationRequest.name,
      },
    });

    if (totalRolesWithSameRoles !== 0) {
      throw new HttpException(`Roles ${request.name} sudah ada`, 400);
    }

    const updateRole = await this.prismaService.roles.update({
      where: { id },
      data: {
        name: validationRequest.name,
      },
    });

    this.wsGateaway.broadcastToAdmin(updateRole);

    return updateRole;
  }

  async deleteRoles(id: number) {
    const dataRoles = await this.prismaService.roles.findUnique({
      where: { id },
    });

    if (!dataRoles) {
      throw new NotFoundException(`Data roles id ${id} tidak ditemukan`);
    }

    this.wsGateaway.broadcastToAdmin(dataRoles);

    await this.prismaService.roles.delete({
      where: { id },
    });
  }
}
