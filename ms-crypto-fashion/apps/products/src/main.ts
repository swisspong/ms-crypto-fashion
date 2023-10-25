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
import { PRODUCTS_SERVICE, PRODUCTS_TCP } from '@app/common/constants/products.constant';



async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(ProductsModule);
  app.useStaticAssets(join(__dirname, '../../../../../../', 'public'));
  console.log("=====================================")
  console.log("init main", join(__dirname, '../../../../../../', 'public'))
  console.log("=====================================")
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
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: PRODUCTS_SERVICE,
        port: Number(configService.get<number>('MICROSERVICE_PORT'))
      }
    }
  )
  app.connectMicroservice(
    rmqService.getOptoins(PRODUCTS_SERVICE)
  )
  await app.startAllMicroservices();

  // * set cors
  const whitelist = ["http://example.com", "http://admin.example.com", "http://merchant.example.com", 'http://admin.cryptofashion.store', 'http://merchant.cryptofashion.store', 'http://cryptofashion.store'];

  app.enableCors({
    origin: (origin, callback) => {
      const isWhitelisted = whitelist.includes(origin)
      console.log("origin =>", origin, isWhitelisted)
      callback(null, isWhitelisted);
    },
    // allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    // methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  })

  await app.listen(configService.get<number>('PORT'));
  console.log("=====================================")
  console.log("init main", join(__dirname, '../../../../../../', 'public'))
  console.log("=====================================")
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();