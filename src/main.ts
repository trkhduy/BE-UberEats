import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useStaticAssets('./');
  app.enableCors({
    origin: [/localhost:\d+/, /192.168.137.1:\d+/, /192.168.137.41:\d+/],
    credentials: true
  })
  await app.listen(3333);
}
bootstrap();
