import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule, JwtUtilsModule, RmqModule, authProviders } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { CartsUtilModule } from '@app/common/utils/carts/carts-util.module';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';
import { CARTS_SERVICE } from '@app/common/constants/carts.constant';
import { JwtStrategy } from '@app/common/strategy';
import { PAYMENT_SERVICE } from '@app/common/constants/payment.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required()
      })
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule,
    RmqModule.register({ name: PRODUCTS_SERVICE }),
    RmqModule.register({ name: CARTS_SERVICE }),
    RmqModule.register({ name: PAYMENT_SERVICE }),
   // JwtUtilsModule,
  ],
  controllers: [OrdersController],
  providers: [
    ...authProviders,
    JwtStrategy,
    OrdersService,
    OrdersRepository,
  ],
})
export class OrdersModule { }
