import { Module } from '@nestjs/common';
import { AntrianPasienService } from './antrian-pasien.service';
import { AntrianPasienController } from './antrian-pasien.controller';

@Module({
  providers: [AntrianPasienService],
  controllers: [AntrianPasienController],
})
export class AntrianPasienModule {}
