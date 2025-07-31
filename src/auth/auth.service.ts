import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  jwtUserPayload,
  LoginRequest,
  UserResponseLogin,
} from 'src/model/user.model';
import { UserValidation } from 'src/user/user.validation';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private validationService: ValidationService,
  ) {}

  async generateAccessToken(user: jwtUserPayload) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role_id,
    };

    return {
      'access-token': await this.jwtService.signAsync(payload),
    };
  }

  async loginWithCrendentials(
    request: LoginRequest,
  ): Promise<UserResponseLogin> {
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

    const response = {
      token,
    };

    return response;
  }
}
