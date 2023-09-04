import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { CartsModule } from '../carts.module';

@Module({
  imports:[CartsModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule {}
