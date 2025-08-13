import { Module } from '@nestjs/common';
import { LoketService } from './loket.service';
import { LoketController } from './loket.controller';

@Module({
  providers: [LoketService],
  controllers: [LoketController],
})
export class LoketModule {}
