import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, JwtUtilsModule, RmqModule, authProviders } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '@app/common/strategy';
import { PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';
import { TransactionPurchase, TransactionPurchaseSchema } from './schemas/transaction.schema';
import { TransactionPurchaseRepository } from './transaction-purchase.repository';
import { Web3Module } from './web3/web3.module';
import { TransactionMerchant, TransactionMerchantSchema } from './schemas/transaction-merchant';
import { TransactionMerchantRepository } from './transaction-merchant.repository';
import { TransactionTemporary, TransactionTemporarySchema } from './schemas/transaction-temporary.schema';
import { TransactionTemporaryRepository } from './transaction-temporary.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required()
      }),
    }),
    RmqModule,
    RmqModule.register({ name: PRODUCTS_SERVICE }),
    RmqModule.register({ name: ORDER_SERVICE }),
    JwtUtilsModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: TransactionPurchase.name, schema: TransactionPurchaseSchema }]),
    MongooseModule.forFeature([{ name: TransactionMerchant.name, schema: TransactionMerchantSchema }]),
    MongooseModule.forFeature([{ name: TransactionTemporary.name, schema: TransactionTemporarySchema }]),
    Web3Module,
    ScheduleModule.forRoot()
  ],
  controllers: [PaymentsController],
  providers: [
    ...authProviders,
    JwtStrategy,
    PaymentsService,
    TransactionMerchantRepository,
    TransactionPurchaseRepository,
    TransactionTemporaryRepository,
    CronService
  ],
  exports: [
    TransactionMerchantRepository,
    TransactionPurchaseRepository,
    TransactionTemporaryRepository
  ]
})
export class PaymentsModule { }
