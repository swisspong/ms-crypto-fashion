import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsRepository } from '../products.repository';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [VariantsController],
  providers: [VariantsService,ProductsRepository],
})
export class VariantsModule {}
