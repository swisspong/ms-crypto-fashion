import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { ConfigModule } from '@nestjs/config';
import { MerchantsModule } from './merchants/merchants.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database/database.module';
import { JwtUtilsModule, authProviders } from '@app/common';
import { JwtStrategy } from '@app/common/strategy';
import { CategoriesModule } from './categories/categories.module';
import { ProductsRepository } from './products.repository';
import { Product, ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),

      })
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    DatabaseModule,
    CategoriesModule,
    MerchantsModule,
    JwtUtilsModule,
  ],
  controllers: [ProductsController],
  providers: [
    ...authProviders,
    ProductsService,
    JwtStrategy,
    ProductsRepository
  ],

})
export class ProductsModule { }
