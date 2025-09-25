import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PasiensService } from './pasiens.service';
import { WebResponse } from 'src/model/web.model';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Pasiens } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';
import { CreatePasiensDto } from './dtos/create-pasiens.dto';
import { UpdatePasiensDto } from './dtos/update-pasiens.dto';
import { PasiensDocs } from './docs/pasiens.docs';

@Controller('/api/pasiens')
export class PasiensController {
  constructor(private pasienService: PasiensService) {}

  @Post(':outletId/outlet')
  @HttpCode(200)
  @ApiOperation(PasiensDocs.store)
  @ApiParam({
    name: 'outletId',
    type: Number,
    description: 'asas',
    required: true,
  })
  async storePasiensController(
    @Param('outletId', ParseIntPipe) outletId: number,
    @Body() body: CreatePasiensDto,
  ): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.storePasienService(body, outletId);

    return ResponseHelper.ok('Successfully added patient data', result);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation(PasiensDocs.update)
  async updatePasienByPenjaminService(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePasiensDto,
  ): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.updatePasienByPenjaminService(
      id,
      body,
    );

    return ResponseHelper.ok('Successfully update patient data', result);
  }
}
