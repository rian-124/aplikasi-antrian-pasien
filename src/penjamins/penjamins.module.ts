import { Module } from '@nestjs/common';
import { PenjaminsService } from './penjamins.service';
import { PenjaminsController } from './penjamins.controller';

@Module({
  providers: [PenjaminsService],
  controllers: [PenjaminsController],
})
export class PenjaminsModule {}
