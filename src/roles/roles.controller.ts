import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesDeleteResponse, RolesResponse } from '../model/roles.model';
import { WebResponse } from '../model/web.model';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseHelper } from 'src/common/response.helper';
import { Roles } from '@prisma/client';
import { CreateRolesDto } from './dtos/create-roles.dto';
import { UpdateRolesDto } from './dtos/update-roles.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';

@ApiTags('Roles')
@Controller('/api/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMIN')
@ApiBearerAuth('access-token')
export class RolesController {
  constructor(private rolesServices: RolesService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Mengambil semua data peran (roles) dari sistem.',
  })
  async getAllRoles(): Promise<WebResponse<Roles[]>> {
    const result = await this.rolesServices.getAllRole();
    return ResponseHelper.ok('successfully retrieved all role data', result);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Menambahkan data peran (role) baru ke dalam sistem.',
  })
  async store(
    @Body() body: CreateRolesDto,
  ): Promise<WebResponse<RolesResponse>> {
    const result = await this.rolesServices.createRoles(body);
    return { data: result };
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update existing role',
    description: 'Memperbarui data peran (role) berdasarkan ID.',
  })
  async updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRolesDto,
  ): Promise<WebResponse<Roles>> {
    const result = await this.rolesServices.updateRoles(id, body);
    return ResponseHelper.ok('Successfully changed role data', result);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a role',
    description: 'Menghapus data peran (role) dari sistem berdasarkan ID.',
  })
  async deleteRoles(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<RolesDeleteResponse>> {
    await this.rolesServices.deleteRoles(id);
    return ResponseHelper.ok('Successfully changed role data');
  }
}
