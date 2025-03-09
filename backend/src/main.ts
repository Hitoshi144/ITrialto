import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:9000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    allowedHeaders: 'Content-Type, Authorization', // Разрешенные заголовки
    credentials: true, // Разрешить отправку к
  })

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
