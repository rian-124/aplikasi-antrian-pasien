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
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  LoginRequest,
  UserDeleteResponse,
  UserRegisterRequest,
  UserResponseRegister,
  UserResposeGetAll,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async index(
    @Query('role') request?: string,
    @Query('keyword') keyword?: string,
  ): Promise<WebResponse<UserResposeGetAll>> {
    let result: UserResposeGetAll;

    if (request) {
      result = await this.userService.getUserByRoleAdmin(request);
    } else if (keyword) {
      result = await this.userService.searchUser(keyword);
    } else {
      result = await this.userService.getAllUser();
    }

    return {
      data: result,
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: Omit<UserUpdateRequest, 'id'>,
  ): Promise<WebResponse<UserUpdateResponse>> {
    const result = await this.userService.updateUser(id, request);

    return {
      data: result,
    };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<UserDeleteResponse>> {
    const result = await this.userService.deleteUser(id);

    return {
      data: result,
    };
  }

  // @Get()
  // @HttpCode(200)
  // async getUserAdmin(
  //   @Query('role') request: RolesResponse,
  // ): Promise<WebResponse<UserResposeGetAll>> {
  //   const result = await this.userService.getUserByRoleAdmin(request);

  //   return {
  //     data: result,
  //   };
  // }

  @Post()
  @HttpCode(200)
  async register(
    @Body() request: UserRegisterRequest,
  ): Promise<WebResponse<UserResponseRegister>> {
    const result = await this.userService.register(request);

    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<UserResponseRegister>> {
    const result = await this.userService.login(request);

    return {
      data: result,
    };
  }
}
