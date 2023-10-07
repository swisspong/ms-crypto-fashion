import { Inject, Injectable, Logger } from '@nestjs/common';
// import { MerchantsRepository } from '../merchants/merchants.repository';
// import { MerchantStatus } from '@app/common/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { log } from 'console';
// import { TransactionTemporaryRepository } from '../transaction-temporary.repository';
// import { TransactionPurchaseRepository } from '../transaction-purchase.repository';
import ShortUniqueId from 'short-unique-id';
import { OrdersRepository } from '../orders.repository';
import { StatusFormat } from '../schemas/order.schema';
import { PAYMENT_SERVICE, RECEIVED_ORDER_EVENT } from '@app/common/constants/payment.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IReceivedOrder } from '@app/common/interfaces/payment.event.interface';
// import { TransactionFormat } from '../schemas/transaction.schema';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsClient: ClientProxy,
    // private readonly transactionTemporaryRepository: TransactionTemporaryRepository,
    // private readonly transactionPurchaseRepository: TransactionPurchaseRepository,
  ) { }

  @Cron(CronExpression.EVERY_30_SECONDS)
  // @Cron('1 * * * * *')
  async handleCron() {
    // this.logger.debug('Called when the current minute is 1');
    const sevenDaysAgo = new Date();
   // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setMinutes(sevenDaysAgo.getMinutes() - 1)
    const orders = await this.ordersRepository.find({
      $and: [
        {

          shipped_at: { $lte: sevenDaysAgo.toISOString() }
        },
        //{ status: { $ne: StatusFormat.RECEIVED } }
        { status: StatusFormat.FULLFILLMENT }
      ]
    })
    const ordersUpdate = await this.ordersRepository.findAndUpdate({
      $and: [{

        shipped_at: { $lte: sevenDaysAgo.toISOString() }
      },
      //{ status: { $ne: StatusFormat.RECEIVED } }
      { status: StatusFormat.FULLFILLMENT }]
    }, { status: StatusFormat.RECEIVED })

    this.logger.warn("corn", sevenDaysAgo.toISOString(), orders, ordersUpdate)
    if (orders.length > 0) {
      await Promise.all(orders.map(async (order) => {
        await this.ordersRepository.findAndUpdate({ order_id: order.order_id }, { $set: { status: StatusFormat.RECEIVED } })
        // event emit 
        const payload: IReceivedOrder = {
          orderId: order.order_id,
          userId: order.user_id
        }
        await lastValueFrom(this.paymentsClient.emit(RECEIVED_ORDER_EVENT, payload))
      }))
      // await this.ordersRepository.createMany(txs.map(tx => ({
      //   amount: tx.amount,
      //   mcht_id: tx.mcht_id,
      //   order_id: tx.order_id,
      //   payment_method: tx.payment_method,
      //   user_id: tx.user_id,
      //   type: TransactionFormat.DEPOSIT,
      //   tx_id: `tx_${this.uid.stamp(15)}`
      // })))
      // await Promise.all(txs.map(async (tx) => {
      //   await this.transactionTemporaryRepository.findOneAndDelete({ tx_id: tx.tx_id })
      // }))
    }
  }
} 
