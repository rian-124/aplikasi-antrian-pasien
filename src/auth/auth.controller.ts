import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { UserResponseLogin } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';

@Controller('/api/users')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @ApiOperation({
    summary: 'User login',
    description: 'Login user ke dalam sistem dan mendapatkan JWT token.',
  })
  @HttpCode(200)
  async login(
    @Body() request: LoginUserDto,
  ): Promise<WebResponse<UserResponseLogin>> {
    const result = await this.authService.loginWithCrendentials(request);
    return ResponseHelper.ok('Login successful', result);
  }
}
