import { NestFactory } from '@nestjs/core';
import { CartsModule } from './carts.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CartsModule);
  const configSercie = app.get<ConfigService>(ConfigService)
  await app.listen(configSercie.get<string>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
