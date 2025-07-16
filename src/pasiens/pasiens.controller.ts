import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PasiensService } from './pasiens.service';
import { PasienWithNomor } from 'src/model/jenis-registrasi.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/pasiens')
export class PasiensController {
  constructor(private pasienService: PasiensService) {}

  @Post()
  @HttpCode(200)
  async store(
    @Body() request: { jenis: 'JAMINAN' | 'UMUM' },
  ): Promise<WebResponse<PasienWithNomor>> {
    const result = await this.pasienService.storePasiens(request);

    return {
      data: result,
    };
  }
}
