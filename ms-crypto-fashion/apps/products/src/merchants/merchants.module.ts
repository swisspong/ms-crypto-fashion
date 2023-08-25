import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { JwtUtilsModule } from '@app/common';
import { MerchantsRepository } from './merchants.repository';
import { Merchant, MerchantSchema } from './schemas/merchant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [JwtUtilsModule, MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }])],
  controllers: [MerchantsController],
  providers: [MerchantsService, MerchantsRepository],
})
export class MerchantsModule { }
