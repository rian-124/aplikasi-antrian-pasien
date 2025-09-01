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
import { WebResponse } from '../model/web.model';
import { AntrianPasienService } from './antrian-pasien.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from 'src/common/response.helper';
import { AntrianPasiens } from '@prisma/client';
import { AuthenticatedRequest } from 'src/model/user.model';
import { UpdateStatusAntrianDto } from './dtos/update-statusAntrian';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import {
  NomorAntrianPasienResponse,
  RecapAntrianPasienResponse,
} from 'src/model/antrianpasien.model';
import { AntrianPasienDocs } from './docs/antrian-pasien.docs';

@Controller('/api/antrian-pasien')
@ApiTags('Antrian Pasien')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class AntrianPasienController {
  constructor(private antrianPasienService: AntrianPasienService) {}
  @Get()
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.getAll)
  async getAntrianPasiensController(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<AntrianPasiens[]>> {
    const result =
      await this.antrianPasienService.getAntrianPasiensService(req);

    return ResponseHelper.ok(
      'Successfully get all data Antrian pasiens',
      result,
    );
  }

  @Get('/recap')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.getRecap)
  async getRecapAntrianPasiensController(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<RecapAntrianPasienResponse>> {
    const result =
      await this.antrianPasienService.getRecapAntrianPasiensService(req);

    return ResponseHelper.ok(
      'Successfully get recap data antrian pasiens',
      result,
    );
  }

  @Get('/daily')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.getDailyAntrianPasien)
  async getDailyAntrianPasiensController(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<AntrianPasiens[]>> {
    const result =
      await this.antrianPasienService.getDailyStatusAntriansService(req);

    return ResponseHelper.ok('Successfully get nomor antrian pasiens', result);
  }

  @Get('/nomor-antrian-pasien')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.getNomorAntrian)
  async getNomorAntriansController(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<NomorAntrianPasienResponse[]>> {
    const result =
      await this.antrianPasienService.getNomorAntrianPasiensService(req);

    return ResponseHelper.ok('Successfully get nomor antrian pasiens', result);
  }

  @Get('/nomor-antrian-pasien/daily')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.getDailyNomorAntrian)
  async getDailyNomorAntriansController(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<NomorAntrianPasienResponse[]>> {
    const result =
      await this.antrianPasienService.getDailyNomorAntriansService(req);

    return ResponseHelper.ok('Successfully get nomor antrian pasiens', result);
  }

  @Get('/search')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.search)
  async searchAntrianPasiensController(
    @Query('keyword') keyword: string,
  ): Promise<WebResponse<AntrianPasiens[]>> {
    const result =
      await this.antrianPasienService.searchStatusAntriansService(keyword);

    return ResponseHelper.ok(
      'Successfully get data antrian pasien by keyword',
      result,
    );
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation(AntrianPasienDocs.update)
  async updateAntrianPasienController(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStatusAntrianDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponse<AntrianPasiens>> {
    const result = await this.antrianPasienService.updateStatusAntriansService(
      id,
      body,
      req,
    );
    return ResponseHelper.ok('Successfully updated id antrian pasiens', result);
  }
}
