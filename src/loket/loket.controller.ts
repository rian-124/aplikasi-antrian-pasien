import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { LoketService } from './loket.service';
import { WebResponse } from 'src/model/web.model';
import { Lokets } from '@prisma/client';
import { ResponseHelper } from 'src/common/response.helper';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { AuthenticatedRequest } from 'src/model/user.model';

@Controller('/api/lokets')
@ApiTags('lokets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view:ADMINUSERS', 'view:ADMIN')
export class LoketController {
  constructor(private loketService: LoketService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'retrieve counter data based on outlet',
    description: 'Mengambil semua data loket berdarkan outlet user',
  })
  async getAllLokets(
    @Req() request: AuthenticatedRequest,
  ): Promise<WebResponse<Lokets[]>> {
    const result = await this.loketService.getAllLokets(request);

    return ResponseHelper.ok('Successfully get all outlets', result);
  }
}
