import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // ✅ Serve static files (images)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // ✅ CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Prefix and validation
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
