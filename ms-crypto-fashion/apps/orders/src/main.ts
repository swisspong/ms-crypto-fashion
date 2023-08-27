import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const configService = app.get<ConfigService>(ConfigService)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptoins(ORDER_SERVICE))
  await app.startAllMicroservices()
  await app.listen(configService.get<number>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
