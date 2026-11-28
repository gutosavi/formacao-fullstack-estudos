import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
