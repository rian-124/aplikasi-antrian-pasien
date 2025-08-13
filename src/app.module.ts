import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AntrianPasienModule } from './antrian-pasien/antrian.pasien.module';
import { PasiensModule } from './pasiens/pasiens.module';
import { OutletsModule } from './outlet/outlet.module';
import { PenjaminsModule } from './penjamins/penjamins.module';
import { LoketModule } from './loket/loket.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    RolesModule,
    AuthModule,
    PasiensModule,
    AntrianPasienModule,
    OutletsModule,
    PenjaminsModule,
    LoketModule,
  ],
})
export class AppModule {}
