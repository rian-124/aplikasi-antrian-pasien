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
import { PasiensDocs } from './docs/pasiens.docs';

@Controller('/api/pasiens')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class PasiensController {
  constructor(private pasienService: PasiensService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation(PasiensDocs.store)
  async storePasiensController(
    @Body() body: CreatePasiensDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<Pasiens>> {
    const result = await this.pasienService.storePasienService(body, req);

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
