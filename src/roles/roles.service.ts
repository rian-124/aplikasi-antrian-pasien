import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RolesRequest, RolesResponse } from 'src/model/roles.model';
import { RolesValidation } from './roles.validation';

@Injectable()
export class RolesService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

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

    return {
      status: 200,
      message: 'Berhasil menambahkan data role',
      name: roles.name,
    };
  }

  async getAllRole() {
    const dataRole = await this.prismaService.roles.findMany();

    return {
      status: 200,
      message: 'Berhasil mengambil data role',
      data: dataRole,
    };
  }
}
