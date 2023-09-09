import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, JwtUtilsModule, RmqModule, authProviders } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT_SERVICE } from '@app/common/constants/product.constant';
import { JwtStrategy } from '@app/common/strategy';

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
      envFilePath: './apps/payments/.env',
    }),
    RmqModule.register({ name: PRODUCT_SERVICE }),
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
export class PaymentsModule {}
