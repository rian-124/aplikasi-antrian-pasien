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
  LoginRequest,
  UserDeleteResponse,
  UserRegisterRequest,
  UserResponseLogin,
  UserResponseRegister,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
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
      status: 200,
      message: 'Berhasil mendaftarkan akun',
      email: user.email,
    };
  }

  async login(request: LoginRequest): Promise<UserResponseLogin> {
    // info request
    this.logger.info(`Login user: ${request.email}`);
    // login request validation
    const loginRequest: LoginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginRequest;
    // if user inst valid
    const user = await this.prismaService.users.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new HttpException('email or password is invalid!', 401);
    }

    const passwordIsValid = await bcrypt.compare(
      loginRequest.password,
      user?.password,
    );

    if (!passwordIsValid) {
      throw new HttpException('email or password is invalid!', 401);
    }

    // generate jwt token

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role_id,
    };

    const token = this.jwtService.sign(payload);

    //login response

    return {
      status: 200,
      message: 'Berhasil login',
      email: user.email,
      role_id: user.role_id,
      outlet_id: user.outlet_id,
      token,
    };
  }

  async getAllUser() {
    const dataAllUser = await this.prismaService.users.findMany();

    return {
      status: 200,
      message: 'Berhasil mengambil data users',
      data: dataAllUser,
    };
  }

  async searchUser(keyword: string) {
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
    });

    return {
      status: 200,
      message: 'Berhasil mengambil data users',
      data: dataUsers,
    };
  }

  async getUserByRoleAdmin(request: string) {
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
    });

    return {
      status: 200,
      message: 'Berhasil mengambil data user berdasarkan role',
      data: dataRoleAdmin,
    };
  }

  async updateUser(
    id: number,
    request: Omit<UserUpdateRequest, 'id'>,
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
      throw new NotFoundException(`User ${existingUser} tidak di temukan`);
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
      status: 200,
      message: 'Berhasil mengupdate data user',
      data: updateUser,
    };
  }

  async deleteUser(id: number): Promise<UserDeleteResponse> {
    const deleteUserById = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!deleteUserById) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }

    await this.prismaService.users.delete({
      where: { id },
    });

    return {
      status: 200,
      message: 'Berhasil menghapus data user',
    };
  }
}
