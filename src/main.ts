import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('RestFull API Antrian Pasien')
    .setDescription(
      'Sistem API Antrian Pasien ini digunakan untuk mengelola proses pendaftaran, pemanggilan, dan pemantauan status antrian pasien di sebuah outlet atau fasilitas layanan kesehatan. API ini mendukung autentikasi JWT dan menyediakan endpoint untuk operasi CRUD pada data pasien, antrian, serta outlet yang terhubung.',
    )
    .setVersion('1.0')
    .addTag('Antrian Pasien')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: '*',
  });
  app.useLogger(logger);

  await app.listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
}
bootstrap();
