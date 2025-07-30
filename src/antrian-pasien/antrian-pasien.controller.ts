import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PasienStatusRequest } from '../model/pasiens.model';
import { WebResponse } from '../model/web.model';
import { AntrianPasienService } from './antrian-pasien.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { AntrianPasiens } from '@prisma/client';
import { AuthenticatedRequest } from 'src/model/user.model';

@Controller('/api/antrian-pasien')
@ApiTags('Antrian Pasien')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class AntrianPasienController {
  constructor(private antrianPasienService: AntrianPasienService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all patient queue status',
    description: 'Mengambil semua data status antrian pasien secara lengkap.',
  })
  async getAll(): Promise<WebResponse<AntrianPasiens[]>> {
    const result = await this.antrianPasienService.getAllStatusAntrian();

    return ResponseHelper.ok(
      'Successfully get all data Antrian pasiens',
      result,
    );
  }

  @Get('/search')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Search patient queue by keyword',
    description:
      'Mencari data status antrian pasien berdasarkan keyword seperti nomor antrian atau nomor registrasi.',
  })
  async search(
    @Query('keyword') keyword: string,
  ): Promise<WebResponse<AntrianPasiens[]>> {
    const result = await this.antrianPasienService.searchStatusAntrian(keyword);

    return ResponseHelper.ok(
      'Successfully get data antrian pasien by keyword',
      result,
    );
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update queue status by ID',
    description:
      'Mengubah status dari antrian pasien berdasarkan ID. Perubahan status ini mengikuti aturan validasi tertentu seperti bintang dan urutan status.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: PasienStatusRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<AntrianPasiens>> {
    const result = await this.antrianPasienService.updateStatusAntrian(
      id,
      request,
      req,
    );
    return ResponseHelper.ok('Successfully updated id antrian pasiens', result);
  }
}
