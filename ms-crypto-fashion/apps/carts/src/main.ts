import { NestFactory } from '@nestjs/core';
import { CartsModule } from './carts.module';

async function bootstrap() {
  const app = await NestFactory.create(CartsModule);
  await app.listen(3000);
}
bootstrap();
