import { Module, forwardRef } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { JwtUtilsModule, RmqModule, authProviders } from '@app/common';
import { MerchantsRepository } from './merchants.repository';
import { Merchant, MerchantSchema } from './schemas/merchant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'apps/auth/src/auth.module';
import { AUTH_SERVICE } from '@app/common/constants';
import { ProductsModule } from '../products.module';
import { OmiseService } from './omise.service';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ComplaintsModule } from '../complaints/complaints.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    JwtUtilsModule,
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule,
    MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }]),
    forwardRef(() => ProductsModule),
    ComplaintsModule,
    CommentsModule
  ],
  controllers: [MerchantsController],
  providers: [
    MerchantsService,
    MerchantsRepository,
    OmiseService
  ],
  exports: [MerchantsRepository]
})
export class MerchantsModule { }
