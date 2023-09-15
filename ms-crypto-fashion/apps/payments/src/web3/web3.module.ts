import { Module, forwardRef } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { PaymentsModule } from '../payments.module';


@Module({
  imports:[forwardRef(()=> PaymentsModule)],
  providers: [Web3Service],
})
export class Web3Module { }
