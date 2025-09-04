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
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  AuthenticatedRequest,
  UserDeleteResponse,
  UserResponseRegister,
} from '../model/user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { Lokets, Users } from '@prisma/client';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { UpdateLoketUserDto } from './dtos/updateLoket-user';
import { UserDocs } from './docs/user.docs';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation(UserDocs.getAllUsers)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN')
  async getAllUsers(): Promise<WebResponse<Users[]>> {
    const result = await this.userService.getUsersService();
    return ResponseHelper.ok('successfully retrieved user data', result);
  }

  @Get('/search')
  @ApiOperation(UserDocs.searchUser)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN')
  async searchUser(
    @Query('keyword') keyword: string,
  ): Promise<WebResponse<Users[]>> {
    const result = await this.userService.searchUserService(keyword);

    return ResponseHelper.ok(
      'successfully retrieved user data based on keyword',
      result,
    );
  }

  @Get('/role')
  @ApiOperation(UserDocs.getUsersByRole)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN')
  async getUsersByrole(
    @Query('role') role: string,
  ): Promise<WebResponse<Users[]>> {
    const result = await this.userService.getUserByRoleAdminService(role);
    return ResponseHelper.ok(
      'successfully retrieved user data based on role',
      result,
    );
  }

  @Patch(':id')
  @ApiOperation(UserDocs.updateUser)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<WebResponse<Users>> {
    const result = await this.userService.updateUserService(id, body);
    return ResponseHelper.ok('successfully changed user data', result);
  }

  @Put('/loket')
  @ApiOperation(UserDocs.updateUserByLokets)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN', 'view:ADMINUSERS')
  async updateUserByLokets(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateLoketUserDto,
  ): Promise<WebResponse<Lokets>> {
    const result = await this.userService.updateUserByLoketService(
      request,
      body,
    );

    return ResponseHelper.ok('Successfully update user loket', result);
  }

  @Put('/loket/checkout')
  @ApiOperation(UserDocs.checkoutUserByLokets)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN', 'view:ADMINUSERS')
  async checkoutUserByLokets(
    @Req() request: AuthenticatedRequest,
  ): Promise<WebResponse<Users>> {
    const result = await this.userService.checkoutUserByLoketService(request);

    return ResponseHelper.ok('Successfully checkout users lokets', result);
  }

  @Delete(':id')
  @ApiOperation(UserDocs.deleteUser)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Permissions('view:ADMIN')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<UserDeleteResponse>> {
    await this.userService.deleteUserService(id);
    return ResponseHelper.ok('User successfully deleted');
  }

  @Post()
  @ApiOperation(UserDocs.register)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMIN')
  async register(
    @Body() body: RegisterUserDto,
  ): Promise<WebResponse<UserResponseRegister>> {
    const result = await this.userService.registerUserService(body);
    return ResponseHelper.ok('successfully created an account', result);
  }
}
