import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS для HTTP и WebSocket
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:9000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Настройка Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
}

bootstrap();