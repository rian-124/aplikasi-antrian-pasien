import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as Winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { WebSocketGateaway } from './websocket.gateaway';
import { ResponseHelper } from './response.helper';
import { PermissionsGuard } from './guards/permissions.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: Winston.format.json(),
      transports: [new Winston.transports.Console()],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    PermissionsGuard,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    WebSocketGateaway,
    ResponseHelper,
  ],
  exports: [
    PrismaService,
    ValidationService,
    WebSocketGateaway,
    ResponseHelper,
    PermissionsGuard,
  ],
})
export class CommonModule {}
