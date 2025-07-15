import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.info('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info('Prisma disconnected');
  }
}
