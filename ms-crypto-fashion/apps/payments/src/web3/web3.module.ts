import { Module, forwardRef } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { PaymentsModule } from '../payments.module';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';
import { RmqModule } from '@app/common';


@Module({
  imports: [
    forwardRef(() => PaymentsModule),
    RmqModule.register({ name: ORDER_SERVICE }),
  ],
  providers: [Web3Service],
  exports: [Web3Service]
})
export class Web3Module { }
