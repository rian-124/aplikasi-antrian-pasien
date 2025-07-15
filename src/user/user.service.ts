import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginRequest,
  UserRegisterRequest,
  UserResponse,
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

  async register(request: UserRegisterRequest): Promise<UserResponse> {
    this.logger.info(`Register new user: ${request.username}`);

    const registerRequest: UserRegisterRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as UserRegisterRequest;

    const totalUserWithSameUsername = await this.prismaService.users.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        username: registerRequest.username,
        password: registerRequest.password,
        role_id: 1,
      },
    });

    return {
      username: user.username,
    };
  }

  async login(request: LoginRequest): Promise<UserResponse> {
    // info request
    this.logger.info(`Login user: ${request.username}`);
    // login request validation
    const loginRequest: LoginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginRequest;
    // if user inst valid
    const user = await this.prismaService.users.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid!', 401);
    }

    const passwordIsValid = await bcrypt.compare(
      loginRequest.password,
      user?.password,
    );

    if (!passwordIsValid) {
      throw new HttpException('Username or password is invalid!', 401);
    }

    // generate jwt token

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role_id,
    };

    const token = this.jwtService.sign(payload);

    //login response

    return {
      username: user.username,
      token,
    };
  }
}
