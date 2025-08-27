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
import { PenjaminsDocs } from './docs/penjamins.docs';

@Controller('/api/penjamins')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class PenjaminsController {
  constructor(private penjaminsService: PenjaminsService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation(PenjaminsDocs.getAll)
  async getPenjaminsController(): Promise<WebResponse<Penjamins[]>> {
    const result = await this.penjaminsService.getPenjaminsService();

    return ResponseHelper.ok('Successfully retreived penjamins data', result);
  }

  @Get('jenis-registrasi')
  @HttpCode(200)
  @ApiOperation(PenjaminsDocs.getByJenisRegistrasi)
  async getPenjaminsJenisRegistrasiController(
    @Query('jenis') jenis: string,
  ): Promise<WebResponse<Penjamins[]>> {
    const result =
      await this.penjaminsService.getPenjaminsByJenisRegistrasiService(jenis);

    return ResponseHelper.ok(
      'Successfully get penjamins by jenis registrasi',
      result,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation(PenjaminsDocs.store)
  async storePenjaminsController(
    @Body()
    body: CreatePenjaminsDto,
  ): Promise<WebResponse<Penjamins>> {
    const result = await this.penjaminsService.storePenjaminService(body);

    return ResponseHelper.ok('Successfully added new penjamins', result);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation(PenjaminsDocs.update)
  async updatePenjaminsController(
    @Param('id') id: number,
    @Body() body: UpdatePenjaminsDto,
  ): Promise<WebResponse<Penjamins>> {
    const result = await this.penjaminsService.updatePenjaminService(id, body);

    return ResponseHelper.ok('Successfully update data penjamins', result);
  }

  @Delete(':id')
  @ApiOperation(PenjaminsDocs.delete)
  async deletePenjaminsController(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<Penjamins>> {
    await this.penjaminsService.deletePenjaminService(id);

    return ResponseHelper.ok('Penjamins successfully deleted');
  }
}
