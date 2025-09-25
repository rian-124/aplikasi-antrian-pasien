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
  UseGuards,
} from '@nestjs/common';
import { OutletService } from './outlet.service';
import { WebResponse } from 'src/model/web.model';
import { OutletsResponse } from 'src/model/outlets.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Outlets } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';
import { CreateOutletsDto } from './dtos/create-outlets.dto';
import { UpdateOutletsDto } from './dtos/update-outlets.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { OutletDocs } from './docs/outlet.docs';

@Controller('/api/outlet')
@ApiTags('Outlet')
export class OutletController {
  constructor(private outletService: OutletService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation(OutletDocs.getAllOutlets)
  @ApiResponse({ status: 200, description: 'Berhasil mengambil data outlet.' })
  async getOutletsController(): Promise<WebResponse<Outlets[]>> {
    const result = await this.outletService.getOutletsService();

    return ResponseHelper.ok('successfully retrieved outlet data', result);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation(OutletDocs.storeOutlets)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMINUSERS', 'view:ADMIN')
  @ApiResponse({ status: 200, description: 'Berhasil menambahkan outlet.' })
  async storeOutletController(
    @Body() body: CreateOutletsDto,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.storeOutletService(body);

    return ResponseHelper.ok('Successfully added data outlets');
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation(OutletDocs.updateOutlets)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMINUSERS', 'view:ADMIN')
  @ApiResponse({ status: 200, description: 'Berhasil memperbarui outlet.' })
  async updateOutletController(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOutletsDto,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.updateOutletService(id, body);

    return ResponseHelper.ok('Successfully updates data outlets');
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation(OutletDocs.deleteOutlets)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('view:ADMINUSERS', 'view:ADMIN')
  @ApiResponse({ status: 200, description: 'Berhasil menghapus outlet.' })
  async deleteOutletController(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<OutletsResponse>> {
    await this.outletService.deleteOutletService(id);

    return ResponseHelper.ok('Success fully deleted data outlets');
  }
}
