import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { ConfigModule } from '@nestjs/config';
import { MerchantsModule } from './merchants/merchants.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database/database.module';
import { JwtUtilsModule, authProviders } from '@app/common';
import { AUTH_SERVICE } from '@app/common/constants';

import { AuthModule } from 'apps/auth/src/auth.module';
import { JwtStrategy } from '@app/common/strategy';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),

      })
    }),
    DatabaseModule,
    CategoriesModule,
    MerchantsModule,
    JwtUtilsModule,
  ],
  controllers: [ProductsController],
  providers: [
    ...authProviders,
    ProductsService,
    JwtStrategy
  ],

})
export class ProductsModule { }
