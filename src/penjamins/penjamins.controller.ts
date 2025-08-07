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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Penjamins } from '@prisma/client';
import { WebResponse } from 'src/model/web.model';
import { PenjaminsService } from './penjamins.service';
import { ResponseHelper } from 'src/common/response.helper';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdatePenjaminsDto } from './dtos/update-penjamins.dto';
import { CreatePenjaminsDto } from './dtos/create-penjamins.dto';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@Controller('/api/penjamins')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class PenjaminsController {
  constructor(private penjaminsService: PenjaminsService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all data penjamins',
    description: 'Mengambil semua data penjamins',
  })
  async getAllPenjamins(): Promise<WebResponse<Penjamins[]>> {
    const result = await this.penjaminsService.getAllPenjamins();

    return ResponseHelper.ok('Successfully retreived penjamins data', result);
  }

  @Get('jenis-registrasi')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get penjamins by jenis registrasi',
    description:
      'Mengambil data penjamins berdasarkan jenis registrasi tertentu. Parameter query jenis digunakan untuk memfilter hasil.',
  })
  async getPenjaminsJenisRegistrasi(
    @Query('jenis') jenis: string,
  ): Promise<WebResponse<Penjamins[]>> {
    const result =
      await this.penjaminsService.getPenjaminsByJenisRegistrasi(jenis);

    return ResponseHelper.ok(
      'Successfully get penjamins by jenis registrasi',
      result,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create new penjamins',
    description:
      'Menambahkan data penjamins baru ke dalam database. Data dikirim melalui body request dengan format sesuai model `PenjaminsCreateDto`.',
  })
  async storePenjamins(
    @Body()
    request: CreatePenjaminsDto,
  ): Promise<WebResponse<Penjamins>> {
    const result = await this.penjaminsService.createPenjamins(request);

    return ResponseHelper.ok('Successfully added new penjamins', result);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update penjamins',
    description:
      'Merubah data penjamins yang ada di dalam database. Data dikirim melalui body request dengn format sesuai Dto `PenjaminsUpdateDto`.',
  })
  async updatePenjamins(
    @Param('id') id: number,
    @Body() request: UpdatePenjaminsDto,
  ): Promise<WebResponse<Penjamins>> {
    const result = await this.penjaminsService.updatePenjamins(id, request);

    return ResponseHelper.ok('Successfully update data penjamins', result);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete penjamins by ID',
    description:
      'Menghapus data penjamins berdasarkan ID. Endpoint ini menggunakan parameter path `id` sebagai acuan untuk menghapus data.',
  })
  async deletePenjamins(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<Penjamins>> {
    await this.penjaminsService.deletePenjamins(id);

    return ResponseHelper.ok('Penjamins successfully deleted');
  }
}
