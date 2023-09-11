import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { LoggerMiddleware } from '@app/common/middlewares';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { VariantGroupsModule } from './variant_groups/variant_groups.module';
import { VariantsModule } from './variants/variants.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { CommentsModule } from './comments/comments.module';
import { AssetsModule } from './assets/assets.module';
import { CARTS_SERVICE } from '@app/common/constants/carts.constant';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        MICROSERVICE_PORT: Joi.number().required(),

      }),
      envFilePath: './apps/products/.env',
    }),
    RmqModule,
    RmqModule.register({ name: CARTS_SERVICE }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    DatabaseModule,
    CategoriesModule,
    MerchantsModule,
    JwtUtilsModule,
    VariantGroupsModule,
    VariantsModule,
    ComplaintsModule,
    CommentsModule,
    AssetsModule,
    ScheduleModule.forRoot()
  ],
  controllers: [ProductsController],
  providers: [
    ...authProviders,
    ProductsService,
    CronService,
    ProductsRepository,
    JwtStrategy
  ],
  exports: [
    ProductsRepository
  ]
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}

