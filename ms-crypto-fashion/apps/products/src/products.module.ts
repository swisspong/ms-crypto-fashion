import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { PRODUCTS_SERVICE } from './constants/services';
import { ConfigModule } from '@nestjs/config';
import { MerchantsModule } from './merchants/merchants.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        // PORT: Joi.number().required(),
      })
    }),
    DatabaseModule,
    RmqModule.register({ name: PRODUCTS_SERVICE }),
    MerchantsModule

  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
