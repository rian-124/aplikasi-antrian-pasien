import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PasiensModule } from './pasiens/pasiens.module';

@Module({
  imports: [CommonModule, UserModule, RolesModule, AuthModule, PasiensModule],
})
export class AppModule {}
