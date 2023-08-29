import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {

  const app = await NestFactory.create(ProductsModule);
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
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host:'products-service',
      port: Number(configService.get<number>('MICROSERVICE_PORT'))
    }
  } as TcpOptions);
  await app.startAllMicroservices();

   // * set cors
   const whitelist = ["http://localhost:3001", "http://localhost:3000", "http://localhost:3002"];

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
