import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserResponseRegister } from '../model/user.model';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private wsGateaway: WebSocketGateaway,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserDto): Promise<UserResponseRegister> {
    this.logger.info(`Register new user: ${request.email}`);

    const totalUserWithSameEmail = await this.prismaService.users.count({
      where: {
        email: request.email,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    request.password = await bcrypt.hash(request.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        email: request.email,
        name: request.name,
        password: request.password,
        outlet_id: request.outlet_id,
        role_id: request.role_id,
      },
    });

    this.wsGateaway.broadcastToAdmin(user);

    return {
      email: user.email,
    };
  }

  async getAllUser(): Promise<Users[]> {
    const dataUsers = await this.prismaService.users.findMany({
      include: {
        outlets: true,
      },
    });

    return dataUsers;
  }

  async searchUser(keyword: string): Promise<Users[]> {
    const dataUsers = await this.prismaService.users.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        outlets: true,
      },
    });

    return dataUsers;
  }

  async getUserByRoleAdmin(request: string): Promise<Users[]> {
    const adminRole = await this.prismaService.roles.findFirst({
      where: {
        name: request,
      },
    });

    if (!adminRole) {
      throw new NotFoundException(`Role ${adminRole} tidak di temukan`);
    }

    const dataRoleAdmin = await this.prismaService.users.findMany({
      where: {
        role_id: adminRole.id,
      },
      include: {
        outlets: true,
      },
    });

    return dataRoleAdmin;
  }

  async updateUser(id: number, request: UpdateUserDto): Promise<Users> {
    this.logger.info(`Update user : ${request.email}`);

    const existingUser = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User ${existingUser} not found`);
    }

    const data: UpdateUserDto = {};

    if (request.name !== undefined) data.name = request.name;

    if (request.email !== undefined) data.email = request.email;

    if (request.password !== undefined)
      data.password = await bcrypt.hash(request.password, 10);

    if (request.outlet_id !== undefined) {
      data.outlet_id = request.outlet_id;
    }

    if (request.role_id !== undefined) data.role_id = request.role_id;

    const updateUser = await this.prismaService.users.update({
      where: { id },
      data,
    });

    this.wsGateaway.broadcastToAdmin(updateUser);

    return updateUser;
  }

  async deleteUser(id: number) {
    const deleteUserById = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!deleteUserById) {
      throw new NotFoundException(`User ${id} not found`);
    }

    this.wsGateaway.broadcastToAdmin(deleteUserById);

    await this.prismaService.users.delete({
      where: { id },
    });
  }
}
