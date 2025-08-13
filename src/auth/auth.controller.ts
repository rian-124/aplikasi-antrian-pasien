import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { UserResponseLogin } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import {
  CheckUsernameDto,
  CheckUsernameResponse,
  ResetPasswordDto,
} from './dtos/reset-password.dto';
import { Users } from '@prisma/client';

@Controller('/api/users')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Login user ke dalam sistem dan mendapatkan JWT token.',
  })
  async login(
    @Body() body: LoginUserDto,
  ): Promise<WebResponse<UserResponseLogin>> {
    const result = await this.authService.loginWithCrendentials(body);
    return ResponseHelper.ok('Login successful', result);
  }

  @Post('/check-email')
  @HttpCode(200)
  async checkEmail(
    @Body()
    body: CheckUsernameDto,
  ): Promise<WebResponse<CheckUsernameResponse>> {
    const result = await this.authService.checkEmail(body);

    return ResponseHelper.ok(
      'Email terdaftar silahkan melakukan reset password',
      result,
    );
  }
  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body()
    body: ResetPasswordDto,
  ): Promise<WebResponse<Users>> {
    await this.authService.resetPassword(body);

    return ResponseHelper.ok(
      'Berhasil melakukan reset password silahkan login',
    );
  }
}
