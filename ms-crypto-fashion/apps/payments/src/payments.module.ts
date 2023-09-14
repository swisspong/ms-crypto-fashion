import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, JwtUtilsModule, RmqModule, authProviders } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '@app/common/strategy';
import { PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';

@Module({
  imports: [
    // RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required()
      }),
      // envFilePath: './apps/payments/.env',
    }),
    RmqModule,
    RmqModule.register({ name: PRODUCTS_SERVICE }),
    RmqModule.register({ name: ORDER_SERVICE }),
    JwtUtilsModule
    // DatabaseModule,
    // MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [PaymentsController],
  providers: [
    ...authProviders,
    JwtStrategy,
    PaymentsService
  ],
})
export class PaymentsModule { }
