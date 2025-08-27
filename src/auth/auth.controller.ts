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
import { AuthDocs } from './docs/auth.docs';

@Controller('/api/users')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @HttpCode(200)
  @ApiOperation(AuthDocs.login)
  async loginController(
    @Body() body: LoginUserDto,
  ): Promise<WebResponse<UserResponseLogin>> {
    const result = await this.authService.loginWithCrendentialsService(body);
    return ResponseHelper.ok('Login successful', result);
  }

  @Post('/check-username')
  @HttpCode(200)
  @ApiOperation(AuthDocs.checkUsername)
  async checkEmailController(
    @Body()
    body: CheckUsernameDto,
  ): Promise<WebResponse<CheckUsernameResponse>> {
    const result = await this.authService.checkUsernameService(body);

    return ResponseHelper.ok(
      'Username terdaftar silahkan melakukan reset password',
      result,
    );
  }
  @Post('/reset-password')
  @HttpCode(200)
  @ApiOperation(AuthDocs.resetPassword)
  async resetPasswordController(
    @Body()
    body: ResetPasswordDto,
  ): Promise<WebResponse<Users>> {
    await this.authService.resetPasswordService(body);

    return ResponseHelper.ok(
      'Berhasil melakukan reset password silahkan login',
    );
  }
}
