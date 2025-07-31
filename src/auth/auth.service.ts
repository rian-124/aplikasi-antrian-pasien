import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponseLogin } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoginUserDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}

  // async generateAccessToken(user: jwtUserPayload) {
  //   const payload = {
  //     email: user.email,
  //     sub: user.id,
  //     role: user.role,
  //   };

  //   return {
  //     'access-token': await this.jwtService.signAsync(payload),
  //   };
  // }

  async loginWithCrendentials(
    request: LoginUserDto,
  ): Promise<UserResponseLogin> {
    // info request
    this.logger.info(`Login user: ${request.email}`);

    // if user inst valid
    const user = await this.prismaService.users.findUnique({
      where: {
        email: request.email,
      },
      include: {
        roles: true,
        outlets: true,
      },
    });

    if (!user) {
      throw new HttpException('email or password is invalid!', 401);
    }

    const passwordIsValid = await bcrypt.compare(
      request.password,
      user?.password,
    );

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
}
