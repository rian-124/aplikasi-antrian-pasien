import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import {
  AuthenticatedRequest,
  UserResponseRegister,
} from '../model/user.model';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { WebSocketGateaway } from 'src/common/websocket.gateaway';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateLoketUserDto } from './dtos/updateLoket-user';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private wsGateaway: WebSocketGateaway,
    private prismaService: PrismaService,
  ) {}

  async register(body: RegisterUserDto): Promise<UserResponseRegister> {
    this.logger.info(`Register new user: ${body.username}`);

    const totalUserWithSameEmail = await this.prismaService.users.count({
      where: {
        username: body.username,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    body.password = await bcrypt.hash(body.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        username: body.username,
        name: body.name,
        password: body.password,
        outlet_id: body.outlet_id,
        role_id: body.role_id,
      },
    });

    this.wsGateaway.broadcastToAdmin(user);

    return {
      username: user.username,
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
            username: {
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
    this.logger.info(`Update user : ${body.username}`);

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

    if (body.username !== undefined) data.username = body.username;

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

  async updateUserByLoket(
    request: AuthenticatedRequest,
    body: UpdateLoketUserDto,
  ): Promise<Users> {
    const users = await this.prismaService.users.findUnique({
      where: {
        id: request.user.sub,
      },
    });

    if (!users) {
      throw new NotFoundException(
        'Tidak dapat menemukan user dengan ID tersebut',
      );
    }

    const loket = await this.prismaService.lokets.findUnique({
      where: {
        id: body.loket_id,
      },
    });

    if (!loket) {
      throw new NotFoundException(
        `Tidak dapat menemukan loket dengan ID tersebut`,
      );
    }

    const isLoketUsed = await this.prismaService.users.findFirst({
      where: {
        loket_id: body.loket_id,
        id: {
          not: users.id,
        },
      },
    });

    if (isLoketUsed) {
      throw new BadRequestException('Loket sudah di gunakan oleh user lain');
    }

    const userLoketUpdate = await this.prismaService.users.update({
      where: {
        id: users.id,
      },
      data: {
        loket_id: body.loket_id,
      },
    });

    this.wsGateaway.broadcastToAdmin(userLoketUpdate);

    return userLoketUpdate;
  }

  async checkoutUserByLoket(request: AuthenticatedRequest): Promise<Users> {
    const users = await this.prismaService.users.findUnique({
      where: {
        id: request.user.sub,
      },
    });

    if (!users) {
      throw new NotFoundException(
        'Tidak dapat menemukan user dengan ID tersebut',
      );
    }

    if (users.loket_id === null) {
      throw new BadRequestException(
        'Users belum memiliki locket tidak dapat melakukan checkut',
      );
    }

    const checkoutUserByLoket = this.prismaService.users.update({
      where: {
        id: users.id,
      },
      data: {
        loket_id: null,
      },
    });

    this.wsGateaway.broadcastToAdmin(checkoutUserByLoket);

    return checkoutUserByLoket;
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
