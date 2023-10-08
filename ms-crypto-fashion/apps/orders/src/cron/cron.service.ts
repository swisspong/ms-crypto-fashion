import { Inject, Injectable, Logger } from '@nestjs/common';
// import { MerchantsRepository } from '../merchants/merchants.repository';
// import { MerchantStatus } from '@app/common/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { log } from 'console';
// import { TransactionTemporaryRepository } from '../transaction-temporary.repository';
// import { TransactionPurchaseRepository } from '../transaction-purchase.repository';
import ShortUniqueId from 'short-unique-id';
import { OrdersRepository } from '../orders.repository';
import { PaymentFormat, StatusFormat } from '../schemas/order.schema';
import { PAYMENT_SERVICE, RECEIVED_ORDER_EVENT } from '@app/common/constants/payment.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { dataLength, ethers, formatEther } from 'ethers';
import { IReceivedOrder } from '@app/common/interfaces/payment.event.interface';
import { PaymentMethodFormat } from '@app/common/enums';
import { PRODUCTS_SERVICE, RETURN_STOCK_EVENT } from '@app/common/constants/products.constant';
import { IProductReturnStockEventPayload } from '@app/common/interfaces/products-event.interface';
// import { TransactionFormat } from '../schemas/transaction.schema';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly uid = new ShortUniqueId()
  private provider: ethers.InfuraWebSocketProvider

  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsClient: ClientProxy,
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,

    // private readonly transactionTemporaryRepository: TransactionTemporaryRepository,
    // private readonly transactionPurchaseRepository: TransactionPurchaseRepository,
  ) {
    this.provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
  }

  @Cron(CronExpression.EVERY_MINUTE)
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
  @Cron(CronExpression.EVERY_MINUTE)
  async handleOrderWallet() {
    const orders = await this.ordersRepository.find({
      payment_status: PaymentFormat.PENDING,
      payment_method: PaymentMethodFormat.WALLET,
      txHash: { $ne: null, $exists: true, }
    })

    const productErrorPayload: IProductReturnStockEventPayload = { data: [] }
    const orderIds: string[] = []
    const result = await Promise.all(orders.map(async order => {
      const receipt = await this.provider.getTransactionReceipt(order.tx_hash)
      if (receipt.status === 1) {
        this.logger.log('Transaction was successful');
        return
      } else if (receipt.status === 0) {
        orderIds.push(order._id.toString())
        order.items.map(item => {
          productErrorPayload.data.push({ mchtId: order.mcht_id, prodId: item.prod_id, vrntId: item.vrnt_id, stock: item.quantity })
        })
        this.logger.error('Transaction failed');
      } else {
        return
        this.logger.warn('Transaction status unknown');
      }

      //  this.logger.log('Receipt:', receipt);
      console.log(receipt)
    }))
    if (productErrorPayload.data.length > 0) {
      await this.ordersRepository.deleteMany({ _id: { $in: orderIds } })
      await lastValueFrom(this.productsClient.emit(RETURN_STOCK_EVENT, productErrorPayload))
    }
  }
} 
