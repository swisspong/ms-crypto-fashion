import { Module } from '@nestjs/common';
import { VariantGroupsService } from './variant_groups.service';
import { VariantGroupsController } from './variant_groups.controller';
import { ProductsModule } from '../products.module';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsRepository } from '../products.repository';
import { MerchantsModule } from '../merchants/merchants.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MerchantsModule
  ],
  controllers: [VariantGroupsController],
  providers: [VariantGroupsService, ProductsRepository],
})
export class VariantGroupsModule { }
