import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  UserDeleteResponse,
  UserRegisterRequest,
  UserResponseRegister,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { Users } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Mengambil seluruh data user yang terdaftar di sistem.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<WebResponse<Users[]>> {
    const result = await this.userService.getAllUser();
    return ResponseHelper.ok('successfully retrieved user data', result);
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search user by keyword',
    description:
      'Cari user berdasarkan nama, email, atau nomor registrasi yang sesuai dengan kata kunci.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async searchUser(
    @Query('keyword') keyword: string,
  ): Promise<WebResponse<Users[]>> {
    const result = await this.userService.searchUser(keyword);

    return ResponseHelper.ok(
      'successfully retrieved user data based on keyword',
      result,
    );
  }

  @Get('/role')
  @ApiOperation({
    summary: 'Get users by role',
    description:
      'Mengambil user berdasarkan peran atau jabatan tertentu seperti admin atau kasir.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUsersByrole(
    @Query('role') role: string,
  ): Promise<WebResponse<Users[]>> {
    const result = await this.userService.getUserByRoleAdmin(role);
    return ResponseHelper.ok(
      'successfully retrieved user data based on role',
      result,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user data',
    description: 'Melakukan pembaruan terhadap data user berdasarkan ID-nya.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UserUpdateRequest,
  ): Promise<WebResponse<UserUpdateResponse>> {
    const result = await this.userService.updateUser(id, request);
    return ResponseHelper.ok('successfully changed user data', result);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Menghapus user berdasarkan ID. Hanya dapat dilakukan oleh admin.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<UserDeleteResponse>> {
    await this.userService.deleteUser(id);
    return ResponseHelper.ok('User successfully deleted');
  }

  @Post()
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Mendaftarkan user baru ke sistem. Hanya bisa dilakukan oleh admin.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() request: UserRegisterRequest,
  ): Promise<WebResponse<UserResponseRegister>> {
    const result = await this.userService.register(request);
    return ResponseHelper.ok('successfully created an account', result);
  }
}
