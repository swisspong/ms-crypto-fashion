import { Inject, Injectable, Logger, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { ethers, formatEther } from 'ethers';
import { TransactionPurchaseRepository } from '../transaction-purchase.repository';
import { IOrderStatusRefundEvent, IUpdateOrderStatusEventPayload } from '@app/common/interfaces/order-event.interface';
import { lastValueFrom } from 'rxjs';
import { ORDER_SERVICE, UPDATE_ORDER_STATUS_EVENT, UPDATE_STATUS_REFUND_EVENT } from '@app/common/constants/order.constant';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentMethodFormat } from '@app/common/enums';
import { TransactionFormat } from '../schemas/transaction.schema';
import ShortUniqueId from 'short-unique-id';
import { IRefundEvent } from '@app/common/interfaces/payment.event.interface';
import { TransactionTemporaryRepository } from '../transaction-temporary.repository';
import BigNumber from 'bignumber.js';
// import { OrdersRepository } from 'src/orders/orders.repository';
// import { PaymentFormat } from 'src/orders/schemas/order.schema';


@Injectable()
export class Web3Service implements OnApplicationBootstrap {
  private readonly logger = new Logger(Web3Service.name)
  private readonly uid = new ShortUniqueId()
  private provider: ethers.InfuraWebSocketProvider;
  // private provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
  CONTRACT_ADDRESS: string
  CONTRACT_ABI: string
  constructor(
    private configService: ConfigService,
    private readonly transactionPurchaseRepository: TransactionPurchaseRepository,
    private readonly transactionTemporaryRepository: TransactionTemporaryRepository,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy
  ) {
    this.logger.warn("start con-------------------------------")
    const cryptoPath = path.join(__dirname, '../../../../../../../apps/payments/src/contracts/CryptoFashionTokenGoerli.json')
    const configuration = JSON.parse(fs.readFileSync(cryptoPath, 'utf8'));
    this.provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
    this.CONTRACT_ADDRESS = this.configService.get<string>("CONTRACT_ADDRESS")
    this.CONTRACT_ABI = configuration;
    this.logger.log(this.CONTRACT_ADDRESS, this.CONTRACT_ABI, this.configService.get<string>("PRIVATE_KEY"))
    this.logger.warn("end con---------------------------------")


  }
  onApplicationBootstrap() {
    console.log("init")
    this.startListening()
  }

  // onModuleInit() {
  //   console.log("init")
  //   this.startListening()
  // }


  async startListening() {
    // const provider = new ethers.JsonRpcProvider(this.configService.get<string>("WEB3_RPC"))

    //const CONTRACT_ADDRESS = configuration.networks["5777"].address
    //const CONTRACT_ABI = configuration.abi;

    
    const output = await this.provider.getBlockNumber();
    console.log(output);
    // contract.listeners("PaymentDone")
    const contract = new ethers.Contract(this.CONTRACT_ADDRESS, this.CONTRACT_ABI, this.provider)
    contract.on('PaymentDone', async (tx, amount, orderId, userId, mchtId, timestamp) => {
      this.logger.log("PaymentDone",tx, amount, orderId, userId, mchtId, timestamp)
      // await this.transactionPurchaseRepository.create(
      //   {
      //     tx_id: `tx_${this.uid.stamp(15)}`,
      //     amount: Number(amount),
      //     type: TransactionFormat.DEPOSIT,
      //     order_id: orderId,
      //     payment_method: PaymentMethodFormat.WALLET,
      //     user_id: userId,
      //     mcht_id: mchtId
      //   }
      // )
      try {
        await this.transactionTemporaryRepository.create({

          tx_id: `tx_${this.uid.stamp(15)}`,
          amount: Number(amount),
          order_id: orderId,
          payment_method: PaymentMethodFormat.WALLET,
          user_id: userId,
          mcht_id: mchtId,
          type: TransactionFormat.DEPOSIT
        })
        const payload: IUpdateOrderStatusEventPayload = {
          user_id: userId,
          orderIds: [orderId],
          chargeId: tx,
          sucess: true
        }

        await lastValueFrom(this.orderClient.emit(UPDATE_ORDER_STATUS_EVENT, payload))
      } catch (error) {
        this.logger.error(error)
      }

    })
    contract.on('RefundDone', async (tx, amount, orderId, userId, mchtId, timestamp) => {
      try {
        this.logger.log(tx, amount, orderId, userId, mchtId, timestamp)
        await this.transactionPurchaseRepository.findOneAndDelete({ order_id: orderId })
        await this.transactionTemporaryRepository.findOneAndDelete({ order_id: orderId, payment_method: PaymentMethodFormat.WALLET, type: TransactionFormat.DEPOSIT })
        // await this.transactionPurchaseRepository.create(
        //   {
        //     tx_id: `tx_${this.uid.stamp(15)}`,
        //     amount: Number(amount),
        //     type: TransactionFormat.REFUND,
        //     order_id: orderId,
        //     payment_method: PaymentMethodFormat.WALLET,
        //     user_id: userId,
        //     mcht_id: mchtId
        //   }
        // )
        const payload: IOrderStatusRefundEvent = {
          orderId: orderId
        }
        await lastValueFrom(this.orderClient.emit(UPDATE_STATUS_REFUND_EVENT, payload))
      } catch (error) {
        this.logger.error(error)
      }


    })

  }
  async startListeningOld() {
    const cryptoPath = path.join(__dirname, '../../../../../../../apps/payments/src/contracts/CryptoFashionTokenGoerli.json')
    const configuration = JSON.parse(fs.readFileSync(cryptoPath, 'utf8'));
    const provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
    // const provider = new ethers.JsonRpcProvider(this.configService.get<string>("WEB3_RPC"))
    this.logger.warn(
      this.configService.get<string>("API_KEY"),
      this.configService.get<string>("CONTRACT_ADDRESS")
    )
    //const CONTRACT_ADDRESS = configuration.networks["5777"].address
    //const CONTRACT_ABI = configuration.abi;
    const CONTRACT_ADDRESS = this.configService.get<string>("CONTRACT_ADDRESS")
    const CONTRACT_ABI = configuration;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    // contract.listeners("PaymentDone")

    contract.on('PaymentDone', async (tx, amount, orderId, userId, mchtId, timestamp) => {
      this.logger.log(tx, amount, orderId, userId, mchtId, timestamp)
      // await this.transactionPurchaseRepository.create(
      //   {
      //     tx_id: `tx_${this.uid.stamp(15)}`,
      //     amount: Number(amount),
      //     type: TransactionFormat.DEPOSIT,
      //     order_id: orderId,
      //     payment_method: PaymentMethodFormat.WALLET,
      //     user_id: userId,
      //     mcht_id: mchtId
      //   }
      // )
      await this.transactionTemporaryRepository.create({

        tx_id: `tx_${this.uid.stamp(15)}`,
        amount: Number(amount),
        order_id: orderId,
        payment_method: PaymentMethodFormat.WALLET,
        user_id: userId,
        mcht_id: mchtId,
        type: TransactionFormat.DEPOSIT
      })
      const payload: IUpdateOrderStatusEventPayload = {
        user_id: userId,
        orderIds: [orderId],
        chargeId: tx,
        sucess: true
      }

      await lastValueFrom(this.orderClient.emit(UPDATE_ORDER_STATUS_EVENT, payload))
    })
    contract.on('RefundDone', async (tx, amount, orderId, userId, mchtId, timestamp) => {
      this.logger.log(tx, amount, orderId, userId, mchtId, timestamp)
      await this.transactionPurchaseRepository.findOneAndDelete({ order_id: orderId })
      await this.transactionTemporaryRepository.findOneAndDelete({ order_id: orderId, payment_method: PaymentMethodFormat.WALLET, type: TransactionFormat.DEPOSIT })
      // await this.transactionPurchaseRepository.create(
      //   {
      //     tx_id: `tx_${this.uid.stamp(15)}`,
      //     amount: Number(amount),
      //     type: TransactionFormat.REFUND,
      //     order_id: orderId,
      //     payment_method: PaymentMethodFormat.WALLET,
      //     user_id: userId,
      //     mcht_id: mchtId
      //   }
      // )
      const payload: IOrderStatusRefundEvent = {
        orderId: orderId
      }
      await lastValueFrom(this.orderClient.emit(UPDATE_STATUS_REFUND_EVENT, payload))
    })

  }
  async refund(data: IRefundEvent) {
    try {
      const valueInWei = new BigNumber(data.amount.toString()); // 1e19 in Wei
      const valueHex = "0x" + valueInWei.toString(16);
      const signer = new ethers.Wallet(this.configService.get<string>("PRIVATE_KEY"), this.provider);
      const contract = new ethers.Contract(this.CONTRACT_ADDRESS, this.CONTRACT_ABI, signer)
      const order = {
        orderId: data.orderId,
        amount: valueHex,
        //amount: data.amount,
        userId: data.userId,
        mchtId: data.mchtId,
      };
      const tx = await contract.refund(data.chrgId, order)
      // await tx.wait();
      this.logger.log('Transaction Hash:', tx.hash);
      this.logger.log('Refund successful.');
    } catch (error) {
      this.logger.error("web3 method error ", error)
    }

  }
  async transferToMerchant(address: string, amount: number) {
    try {

      const valueInWei = new BigNumber(amount.toString()); // 1e19 in Wei
      const valueHex = "0x" + valueInWei.toString(16);
      const signer = new ethers.Wallet(this.configService.get<string>("PRIVATE_KEY"), this.provider);
      const contract = new ethers.Contract(this.CONTRACT_ADDRESS, this.CONTRACT_ABI, signer)
      this.logger.warn("amount", amount)
      const tx = await contract.withdraw(address, valueHex)
      await tx.wait();
      this.logger.log('Transaction Hash:', tx.hash);
      this.logger.log('With draw success successful.');
    } catch (error) {
      this.logger.log(error)
      throw error
    }
  }
  async refundOld(data: IRefundEvent) {
    try {
      const cryptoPath = path.join(__dirname, '../../../../../../../apps/payments/src/contracts/CryptoFashionTokenGoerli.json')
      const configuration = JSON.parse(fs.readFileSync(cryptoPath, 'utf8'));
      const CONTRACT_ABI = configuration;
      const provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
      const CONTRACT_ADDRESS = this.configService.get<string>("CONTRACT_ADDRESS")
      const signer = new ethers.Wallet(this.configService.get<string>("PRIVATE_KEY"), provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      this.logger.warn(this.configService.get<string>("PRIVATE_KEY"), CONTRACT_ADDRESS)
      const order = {
        orderId: data.orderId,
        amount: data.amount, // Replace with the desired amount
        userId: data.userId,
        mchtId: data.mchtId,
      };

      const tx = await contract.refund(data.chrgId, order)
      // await tx.wait();
      this.logger.log('Transaction Hash:', tx.hash);
      this.logger.log('Refund successful.');
      // const tx = await signer.sendTransaction({
      //   to: CONTRACT_ADDRESS,
      //   data: (contract.methods as any)
      //     .refund(
      //       data.chrgId,
      //       [data.orderId, data.amount, data.userId, data.mchtId]
      //     )
      //     .encodeABI(),
      // });
      // this.logger.warn("refund transaction =>", tx)
    } catch (error) {
      this.logger.error("web3 method error ", error)
    }

  }
  async transferToMerchantOld(address: string, amount: number) {
    try {
      const cryptoPath = path.join(__dirname, '../../../../../../../apps/payments/src/contracts/CryptoFashionTokenGoerli.json')
      const configuration = JSON.parse(fs.readFileSync(cryptoPath, 'utf8'));
      const CONTRACT_ABI = configuration;
      const provider = new ethers.InfuraWebSocketProvider('goerli', "b64de7c107a44261bb1b19536d7bed23",)
      const CONTRACT_ADDRESS = this.configService.get<string>("CONTRACT_ADDRESS")
      const signer = new ethers.Wallet(this.configService.get<string>("PRIVATE_KEY"), provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      this.logger.warn(this.configService.get<string>("PRIVATE_KEY"), CONTRACT_ADDRESS)
      this.logger.warn("amount", amount)
      const tx = await contract.withdraw(address, Number(amount))
      await tx.wait();
      this.logger.log('Transaction Hash:', tx.hash);
      this.logger.log('With draw success successful.');
    } catch (error) {
      throw error
    }
  }
}
