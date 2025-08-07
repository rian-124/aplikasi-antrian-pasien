import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PasiensService } from './pasiens.service';
import { WebResponse } from 'src/model/web.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Pasiens } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';
import { CreatePasiensDto } from './dtos/create-pasiens.dto';
import { UpdatePasiensDto } from './dtos/update-pasiens.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthenticatedRequest } from 'src/model/user.model';

@Controller('/api/pasiens')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class PasiensController {
  constructor(private pasienService: PasiensService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create new patient queue',
    description:
      'Membuat data pasien baru berdasarkan input dari form, baik untuk jaminan maupun umum.',
  })
  async store(
    @Body() request: CreatePasiensDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.storePasiens(request, req);

    return ResponseHelper.ok('Successfully added patient data', result);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePasiensDto,
  ): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.updatePasiensPenjamins(id, request);

    return ResponseHelper.ok('Successfully update patient data', result);
  }
}
