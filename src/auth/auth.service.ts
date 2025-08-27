import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponseLogin } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoginUserDto } from './dtos/login.dto';
import {
  CheckUsernameResponse,
  CheckUsernameDto,
  JwtUsernameUsersPayload,
  ResetPasswordDto,
} from './dtos/reset-password.dto';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}

  async loginWithCrendentialsService(
    body: LoginUserDto,
  ): Promise<UserResponseLogin> {
    // info body
    this.logger.info(`Login user: ${body.username}`);

    // if user inst valid
    const user = await this.prismaService.users.findUnique({
      where: {
        username: body.username,
      },
      include: {
        roles: true,
        outlets: true,
      },
    });

    if (!user) {
      throw new HttpException('username or password is invalid!', 401);
    }

    const passwordIsValid = await bcrypt.compare(body.password, user?.password);

    if (!passwordIsValid) {
      throw new HttpException('username or password is invalid!', 401);
    }

    // generate jwt token

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.roles.name,
      outlet: user.outlets.nama_outlet,
      permission: [`view:${user.roles.name}`],
    };

    const token = this.jwtService.sign(payload);

    //login response

    const response = {
      token,
    };

    return response;
  }

  async checkUsernameService(
    body: CheckUsernameDto,
  ): Promise<CheckUsernameResponse> {
    const users = await this.prismaService.users.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!users) {
      throw new NotFoundException('Username tidak terdaftar');
    }

    const payload = {
      sub: users.id,
      username: users.username,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const response = {
      token,
    };

    return response;
  }

  async resetPasswordService(body: ResetPasswordDto): Promise<Users> {
    const payload: JwtUsernameUsersPayload = this.jwtService.verify(body.token);

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    const resetNewPassword = await this.prismaService.users.update({
      where: {
        id: payload.sub,
      },
      data: {
        password: hashedPassword,
      },
    });

    return resetNewPassword;
  }
}
