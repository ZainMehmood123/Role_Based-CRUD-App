import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js URL
    credentials: true,
  });

  // Set global prefix for all APIs (optional)
  app.setGlobalPrefix('api');

  // Apply validation globally
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
