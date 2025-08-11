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
import { OutletService } from './outlet.service';
import { WebResponse } from 'src/model/web.model';
import { OutletsResponse } from 'src/model/outlets.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Outlets } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';
import { CreateOutletsDto } from './dtos/create-outlets.dto';
import { UpdateOutletsDto } from './dtos/update-outlets.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';

@Controller('/api/outlet')
@ApiTags('Outlet')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class OutletController {
  constructor(private outletService: OutletService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all outlets',
    description: 'Mengambil seluruh data outlet yang tersedia.',
  })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil data outlet.' })
  async getAllOutlets(): Promise<WebResponse<Outlets[]>> {
    const result = await this.outletService.getAllOutlets();

    return ResponseHelper.ok('successfully retrieved outlet data', result);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new outlet',
    description: 'Menambahkan data outlet baru ke dalam sistem.',
  })
  @ApiResponse({ status: 200, description: 'Berhasil menambahkan outlet.' })
  async storeOutlets(
    @Body() body: CreateOutletsDto,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.storeOutlets(body);

    return ResponseHelper.ok('Successfully added data outlets');
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update outlet by ID',
    description: 'Memperbarui data outlet berdasarkan ID yang diberikan.',
  })
  @ApiResponse({ status: 200, description: 'Berhasil memperbarui outlet.' })
  async updateOutlets(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOutletsDto,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.updateOutlets(id, body);

    return ResponseHelper.ok('Successfully updates data outlets');
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete outlet by ID',
    description: 'Menghapus outlet berdasarkan ID yang diberikan.',
  })
  @ApiResponse({ status: 200, description: 'Berhasil menghapus outlet.' })
  async deleteOutlets(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.deleteOutlets(id);

    return ResponseHelper.ok('Success fully deleted data outlets');
  }
}
