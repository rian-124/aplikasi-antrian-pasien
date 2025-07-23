import { Controller, Get, HttpCode } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { WebResponse } from 'src/model/web.model';
import { OutletsResponse } from 'src/model/outlets.model';

@Controller('/api/outlet')
export class OutletController {
  constructor(private outletService: OutletService) {}

  @Get()
  @HttpCode(200)
  async index(): Promise<WebResponse<OutletsResponse>> {
    const result = await this.outletService.getAllOutlets();

    return {
      data: result,
    };
  }
}
