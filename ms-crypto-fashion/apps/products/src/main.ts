import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { RmqService } from '@app/common/rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptoins('PRODUCTS'))
  await app.startAllMicroservices()
  await app.listen(3000);
}
bootstrap();
