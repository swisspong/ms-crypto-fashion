import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { RmqService } from '@app/common';
import { PRODUCTS_SERVICE } from '@app/common/constants/products.constant';



async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(ProductsModule);
  app.useStaticAssets(join(__dirname, '../../../../../../', 'public'));
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
    .addTag('Merchant')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  const configService = app.get<ConfigService>(ConfigService)

  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice([{
    transport: Transport.TCP,
    options: {
      host: PRODUCTS_SERVICE,
      port: Number(configService.get<number>('MICROSERVICE_PORT'))
    }
  },
  rmqService.getOptoins(PRODUCTS_SERVICE)
  ])
  await app.startAllMicroservices();

  // * set cors
  const whitelist = ["http://example.com", "http://admin.example.com", "http://merchant.example.com"];

  app.enableCors({
    origin: (origin, callback) => {
      const isWhitelisted = whitelist.includes(origin)
      callback(null, isWhitelisted);
    },
    credentials: true,
  })

  await app.listen(configService.get<number>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();