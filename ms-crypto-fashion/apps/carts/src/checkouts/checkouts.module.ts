import { Module, forwardRef } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { CartsModule } from '../carts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkout, CheckoutSchema } from './schemas/checkout.schema';
import { DatabaseModule } from '@app/common';
import { CheckoutsRepository } from './checkouts.repository';

@Module({
  imports: [
    forwardRef(() => CartsModule),
    MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]),
    DatabaseModule,
  ],
  controllers: [CheckoutsController],
  providers: [CheckoutsService,CheckoutsRepository],
})
export class CheckoutsModule { }
