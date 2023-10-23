import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsRepository } from '../products.repository';
import { MerchantsModule } from '../merchants/merchants.module';
import { CARTS_SERVICE } from '@app/common/constants/carts.constant';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MerchantsModule,
    RmqModule.register({ name: CARTS_SERVICE }),
  ],
  controllers: [VariantsController],
  providers: [VariantsService, ProductsRepository],
})
export class VariantsModule { }
