import { NestFactory } from '@nestjs/core';
import { CartsModule } from './carts.module';
import * as cookieParser from "cookie-parser"
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CartsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('Crypto fashion')
    .setDescription('The Crypto fashion API description')
    .setVersion('1.0')
    .addTag('Carts')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  const configSercie = app.get<ConfigService>(ConfigService)
  const whitelist = ["http://example.com"];

  app.enableCors({
    origin: (origin, callback) => {
      const isWhitelisted = whitelist.includes(origin)
      callback(null, isWhitelisted);
    },
    credentials: true,
  })
  await app.listen(configSercie.get<string>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
