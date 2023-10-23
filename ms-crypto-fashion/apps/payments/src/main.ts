import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RmqService } from '@app/common';
import { PAYMENT_SERVICE } from '@app/common/constants/payment.constant';
async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )
  app.use(cookieParser())
  const option = new DocumentBuilder()
    .setTitle('Crypto fashion')
    .setDescription('The Crypto fashion API description')
    .setVersion('1.0')
    .addTag('Payment')
    .build()
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('', app, document);
  const configService = app.get<ConfigService>(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptoins(PAYMENT_SERVICE))
  await app.startAllMicroservices()
  // * set cors
  const whitelist = ["http://example.com", "http://merchant.example.com"];

  app.enableCors({
    origin: (origin, callback) => {
      const isWhitelisted = whitelist.includes(origin)
      console.log('origin =>',origin,isWhitelisted)
      callback(null, isWhitelisted);
    },
    credentials: true,
  })

  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
