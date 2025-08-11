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
  CheckEmailDto,
  CheckEmailResponse,
  JwtEmailUsersPayload,
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

  async loginWithCrendentials(body: LoginUserDto): Promise<UserResponseLogin> {
    // info body
    this.logger.info(`Login user: ${body.email}`);

    // if user inst valid
    const user = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
      include: {
        roles: true,
        outlets: true,
      },
    });

    if (!user) {
      throw new HttpException('email or password is invalid!', 401);
    }

    const passwordIsValid = await bcrypt.compare(body.password, user?.password);

    if (!passwordIsValid) {
      throw new HttpException('email or password is invalid!', 401);
    }

    // generate jwt token

    const payload = {
      sub: user.id,
      email: user.email,
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

  async checkEmail(body: CheckEmailDto): Promise<CheckEmailResponse> {
    const users = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!users) {
      throw new NotFoundException('Email tidak terdaftar');
    }

    const payload = {
      sub: users.id,
      email: users.email,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const response = {
      token,
    };

    return response;
  }

  async resetPassword(body: ResetPasswordDto): Promise<Users> {
    const payload: JwtEmailUsersPayload = this.jwtService.verify(body.token);

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
