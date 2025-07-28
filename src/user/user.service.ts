import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  UserRegisterRequest,
  UserResponseRegister,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: UserRegisterRequest): Promise<UserResponseRegister> {
    this.logger.info(`Register new user: ${request.email}`);

    const registerRequest: UserRegisterRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as UserRegisterRequest;

    const totalUserWithSameEmail = await this.prismaService.users.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        email: registerRequest.email,
        name: registerRequest.name,
        password: registerRequest.password,
        outlet_id: registerRequest.outlet_id,
        role_id: registerRequest.role_id,
      },
    });

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

  async updateUser(
    id: number,
    request: UserUpdateRequest,
  ): Promise<UserUpdateResponse> {
    this.logger.info(`Update user : ${request.email}`);

    const UserUpdateRequest =
      this.validationService.validate<UserUpdateRequest>(
        UserValidation.UPDATE,
        request,
      );

    const existingUser = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User ${existingUser} not found`);
    }

    const data: UserUpdateRequest = {};

    if (UserUpdateRequest.name !== undefined)
      data.name = UserUpdateRequest.name;

    if (UserUpdateRequest.email !== undefined)
      data.email = UserUpdateRequest.email;

    if (UserUpdateRequest.password !== undefined)
      data.password = await bcrypt.hash(UserUpdateRequest.password, 10);

    if (UserUpdateRequest.outlet_id !== undefined) {
      data.outlet_id = UserUpdateRequest.outlet_id;
    }

    if (UserUpdateRequest.role_id !== undefined)
      data.role_id = UserUpdateRequest.role_id;

    const updateUser = await this.prismaService.users.update({
      where: { id },
      data,
    });

    return {
      data: updateUser,
    };
  }

  async deleteUser(id: number) {
    const deleteUserById = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!deleteUserById) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.prismaService.users.delete({
      where: { id },
    });
  }
}
