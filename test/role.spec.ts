import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('/POST api/users', () => {
    afterEach(async () => {
      await testService.resetDatabase();
    });

    it('Should be able store roles', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/roles')
        .send({
          name: 'ADMIN',
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('ADMIN');
    });
  });
});
