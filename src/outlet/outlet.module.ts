import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';

@Module({
  providers: [OutletService],
  controllers: [OutletController],
})
export class OutletsModule {}
