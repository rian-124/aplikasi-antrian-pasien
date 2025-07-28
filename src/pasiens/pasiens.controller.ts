import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PasiensService } from './pasiens.service';
import { WebResponse } from 'src/model/web.model';
import { PasiensRequest } from '../model/pasiens.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Pasiens } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';

@Controller('/api/pasiens')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class PasiensController {
  constructor(private pasienService: PasiensService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create new patient queue',
    description:
      'Membuat data pasien baru berdasarkan input dari form, baik untuk jaminan maupun umum.',
  })
  async store(@Body() request: PasiensRequest): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.storePasiens(request);

    return ResponseHelper.ok('Successfully added patient data', result);
  }
}
