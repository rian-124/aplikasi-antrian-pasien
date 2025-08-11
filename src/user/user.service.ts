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

  async register(body: RegisterUserDto): Promise<UserResponseRegister> {
    this.logger.info(`Register new user: ${body.email}`);

    const totalUserWithSameEmail = await this.prismaService.users.count({
      where: {
        email: body.email,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    body.password = await bcrypt.hash(body.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
        outlet_id: body.outlet_id,
        role_id: body.role_id,
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
        roles: true,
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

  async getUserByRoleAdmin(body: string): Promise<Users[]> {
    const adminRole = await this.prismaService.roles.findFirst({
      where: {
        name: body,
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

  async updateUser(id: number, body: UpdateUserDto): Promise<Users> {
    this.logger.info(`Update user : ${body.email}`);

    const existingUser = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User ${existingUser} not found`);
    }

    const data: UpdateUserDto = {};

    if (body.name !== undefined) data.name = body.name;

    if (body.email !== undefined) data.email = body.email;

    if (body.password !== undefined)
      data.password = await bcrypt.hash(body.password, 10);

    if (body.outlet_id !== undefined) {
      data.outlet_id = body.outlet_id;
    }

    if (body.role_id !== undefined) data.role_id = body.role_id;

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
