import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AntrianPasienAll,
  AntrianStatusMessage,
  PasienStatusRequest,
} from '../model/pasiens.model';
import { WebResponse } from '../model/web.model';
import { AntrianPasienService } from './antrian-pasien.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/api/antrian-pasien')
export class AntrianPasienController {
  constructor(private antrianPasienService: AntrianPasienService) {}

  @Get()
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  async getAll(): Promise<WebResponse<AntrianPasienAll>> {
    const result = await this.antrianPasienService.getAllStatusAntrian();

    return {
      data: result,
    };
  }

  @Get('/search')
  @HttpCode(200)
  async search(
    @Query('keyword') keyword: string,
  ): Promise<WebResponse<AntrianPasienAll>> {
    const result = await this.antrianPasienService.searchStatusAntrian(keyword);

    return {
      data: result,
    };
  }

  @Post()
  @HttpCode(200)
  async update(
    @Body() request: PasienStatusRequest,
  ): Promise<WebResponse<AntrianStatusMessage>> {
    const result = await this.antrianPasienService.updateStatusAntrian(request);
    return {
      data: result,
    };
  }
}
