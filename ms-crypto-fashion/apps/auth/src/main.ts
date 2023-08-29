import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';
import { AUTH_SERVICE } from '@app/common/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
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
    .addTag('Auth')
    .addTag('User')
    .addTag('Permission')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  const configService = app.get<ConfigService>(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptoins(AUTH_SERVICE))
  await app.startAllMicroservices()

  // * set cors
  const whitelist = ["http://localhost:3001", "http://localhost:3000", "http://localhost:3002"];

  app.enableCors({
    origin: (origin, callback) => {
      const isWhitelisted = whitelist.includes(origin)
      callback(null, isWhitelisted);
    },
    credentials: true,
  })

  await app.listen(configService.get<string>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
