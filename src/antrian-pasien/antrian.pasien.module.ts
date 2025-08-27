import { Module } from '@nestjs/common';
import { AntrianPasienService } from './antrian-pasien.service';
import { AntrianPasienController } from './antrian-pasien.controller';
import { AntrianPasienRepository } from './antrian-pasien.repository';

@Module({
  providers: [AntrianPasienService, AntrianPasienRepository],
  controllers: [AntrianPasienController],
})
export class AntrianPasienModule {}
