import { Module } from '@nestjs/common';
import { PasiensService } from './pasiens.service';
import { PasiensController } from './pasiens.controller';

@Module({
  providers: [PasiensService],
  controllers: [PasiensController],
})
export class PasiensModule {}
