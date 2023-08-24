import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { PRODUCTS_SERVICE } from './constants/services';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
    RmqModule.register({ name: PRODUCTS_SERVICE })
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
