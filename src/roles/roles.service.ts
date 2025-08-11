import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RolesResponse } from 'src/model/roles.model';
import { Roles } from '@prisma/client';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';
import { CreateRolesDto } from './dtos/create-roles.dto';
import { UpdateRolesDto } from './dtos/update-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private wsGateaway: WebSocketGateaway,
    private prismaService: PrismaService,
  ) {}

  async getAllRole(): Promise<Roles[]> {
    const dataRole = await this.prismaService.roles.findMany();

    return dataRole;
  }

  async createRoles(body: CreateRolesDto): Promise<RolesResponse> {
    this.logger.info(`Add new roles ${body.name}`);

    const totalRolesWithSameRoles = await this.prismaService.roles.count({
      where: {
        name: body.name,
      },
    });

    if (totalRolesWithSameRoles !== 0) {
      throw new HttpException('Roles already exists', 400);
    }

    const roles = await this.prismaService.roles.create({
      data: {
        name: body.name,
      },
    });

    this.wsGateaway.broadcastToAdmin(roles);

    return {
      name: roles.name,
    };
  }

  async updateRoles(id: number, body: UpdateRolesDto): Promise<Roles> {
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
        name: body.name,
      },
    });

    if (totalRolesWithSameRoles !== 0) {
      throw new HttpException(`Roles ${body.name} sudah ada`, 400);
    }

    const updateRole = await this.prismaService.roles.update({
      where: { id },
      data: {
        name: body.name,
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
