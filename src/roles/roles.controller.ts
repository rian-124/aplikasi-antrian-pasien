import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { RolesRequest, RolesResponse } from '../model/roles.model';
import { WebResponse } from '../model/web.model';
import { RolesService } from './roles.service';

@Controller('/api/roles')
export class RolesController {
  constructor(private rolesServices: RolesService) {}

  @Get()
  @HttpCode(200)
  async index(): Promise<WebResponse<RolesResponse>> {
    const result = await this.rolesServices.getAllRole();

    return {
      data: result,
    };
  }

  @Post()
  @HttpCode(200)
  async rolesStore(
    @Body() request: RolesRequest,
  ): Promise<WebResponse<RolesResponse>> {
    const result = await this.rolesServices.createRoles(request);

    return {
      data: result,
    };
  }
}
