import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import * as Omise from 'omise';
import { CreditCardPaymentDto } from './dto/payment-credit-card.dto';
import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { IReceivedOrder, IRefundEvent, PaidOrderingEvent, UpdateChargeMerchant } from '@app/common/interfaces/payment.event.interface';
import { CHARGE_MONTH_EVENT, PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { ORDER_SERVICE, UPDATE_ORDER_STATUS_EVENT, UPDATE_STATUS_REFUND_EVENT } from '@app/common/constants/order.constant';
import { IOrderStatusRefundEvent, IUpdateOrderStatusEventPayload } from '@app/common/interfaces/order-event.interface';
import { PaymentMethodFormat } from '@app/common/enums';
import { TransactionPurchaseRepository } from './transaction-purchase.repository';
import ShortUniqueId from 'short-unique-id';
import { TransactionFormat } from './schemas/transaction.schema';
import { TransactionMerchantRepository } from './transaction-merchant.repository';
import { Web3Service } from './web3/web3.service';
import { TransactionTemporaryRepository } from './transaction-temporary.repository';

import { WithdrawDto } from './dto/create-recipient.dto';
import axios from 'axios';
import { WithdrawEthDto } from './dto/withdraw-eth.dto';


@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private readonly uid = new ShortUniqueId()
  private readonly omise: Omise.IOmise = Omise({
    publicKey: process.env.OMISE_PUBLIC_KEY,
    secretKey: process.env.OMISE_SECRET_KEY,
  })

  constructor(
    private readonly transactionPurchaseRepository: TransactionPurchaseRepository,
    private readonly transactionMerchantRepository: TransactionMerchantRepository,
    private readonly transactionTemporaryRepository: TransactionTemporaryRepository,
    private readonly web3Service: Web3Service,

    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy
  ) { }
  async healthCheck() {
    return { message: "success" }
  }

  async receivedOrder(data: IReceivedOrder) {
    const { orderId, userId } = data
    const txTmp = await this.transactionTemporaryRepository.findOne({ order_id: orderId, user_id: userId, type: TransactionFormat.DEPOSIT })
    const tx = await this.transactionPurchaseRepository.findOne({ order_id: orderId, user_id: userId })
    if (txTmp) {
      if (!tx) {
        await this.transactionPurchaseRepository.create({
          amount: txTmp.amount,
          mcht_id: txTmp.mcht_id,
          order_id: txTmp.order_id,
          payment_method: txTmp.payment_method,
          type: TransactionFormat.DEPOSIT,
          user_id: txTmp.user_id,
          tx_id: `tx_${this.uid.stamp(15)}`
        })
      }
      await this.transactionTemporaryRepository.findOneAndDelete({ order_id: orderId, user_id: userId, type: TransactionFormat.DEPOSIT })
    }


  }

  // TODO: charge for open shop
  async openShopCreditCard(mcht_id: string, creaditCardPaymentDto: CreditCardPaymentDto) {
    try {
      const { amount_, token } = creaditCardPaymentDto
      const amount = amount_ * 100 //convert amount_


      const charge = await this.omise.charges.create({
        amount: amount,
        currency: 'thb',
        card: token
      });


      // const amount_convert = charge.amount / 100;
      const amount_convert = amount / 100;
      // set  date
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month_ = ((currentDate.getMonth() + 2).toString().padStart(2, '0'))
      const day = currentDate.getDate().toString().padStart(2, '0');
      // option end date in merchant database
      const end_date_credit = `${year}-${month_}-${day}`

      await this.transactionMerchantRepository.create({
        tsmcht_id: `tamcht_${this.uid.stamp(15)}`,
        amount: amount_convert,
        mcht_id
      })

      const data: UpdateChargeMerchant = {
        amount: amount_convert,
        end_date: end_date_credit,
        mcht_id
      }

      await lastValueFrom(
        this.productClient.emit(CHARGE_MONTH_EVENT, {
          ...data
        })
      )

      return { message: "success" }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  async getPaymentCheck() {
    return "check payments"
  }


  async paidManyOrders(data: PaidOrderingEvent) {
    try {

      const { amount_, token, orders, chkt_id, user_id, payment_method } = data

      if (payment_method === PaymentMethodFormat.CREDIT) {
        const amount = amount_ * 100 //convert amount_
        const charge = await this.omise.charges.create({
          amount: amount,
          currency: 'thb',
          card: token
        });
        const payload: IUpdateOrderStatusEventPayload = {
          user_id,
          chkt_id,
          orderIds: orders.map(order => order.orderId),
          sucess: true,
          chargeId: charge.id
        }
        await this.transactionTemporaryRepository.createMany(orders.map(order => ({
          tx_id: `tx_${this.uid.stamp(15)}`,
          amount: order.total,
          order_id: order.orderId,
          payment_method: PaymentMethodFormat.CREDIT,
          user_id,
          mcht_id: order.mchtId,
          type: TransactionFormat.DEPOSIT
        })))
        // await this.transactionPurchaseRepository.createMany(
        //   orders.map(order => ({
        //     tx_id: `tx_${this.uid.stamp(15)}`,
        //     amount: order.total,
        //     type: TransactionFormat.DEPOSIT,
        //     order_id: order.orderId,
        //     payment_method: PaymentMethodFormat.CREDIT,
        //     user_id,
        //     mcht_id: order.mchtId
        //   })))
        await lastValueFrom(this.orderClient.emit(UPDATE_ORDER_STATUS_EVENT, payload))
      } else {

      }
    } catch (error) {
      this.logger.log(error)
    }

  }
  async evnetRefund(data: IRefundEvent) {
    console.log("refund receive", data)
    const userTx = await this.transactionPurchaseRepository.findOne({ order_id: data.orderId })
    const userTxTmp = await this.transactionTemporaryRepository.findOne({ order_id: data.orderId, type: TransactionFormat.DEPOSIT })
    // const isHasWithdraw = userTxs.some(tx => tx.type === TransactionFormat.WITHDRAW)
    // const isHasRefund = userTxs.some(tx => tx.type === TransactionFormat.REFUND)
    // const txDeposit = userTxs.find(tx => tx.type === TransactionFormat.DEPOSIT)
    if (!userTxTmp && !userTx) return

    // if (isHasRefund && isHasWithdraw || !txDeposit) {
    //   return
    // }
    const payload: IOrderStatusRefundEvent = {
      orderId: data.orderId
    }
    if (
      (userTx && userTx.payment_method === PaymentMethodFormat.CREDIT && data.method === PaymentMethodFormat.CREDIT) ||
      (userTxTmp && userTxTmp.payment_method === PaymentMethodFormat.CREDIT && data.method === PaymentMethodFormat.CREDIT)
    ) {

      const charge = await this.omise.charges.createRefund(
        data.chrgId,
        { amount: userTxTmp ? userTxTmp.amount : userTx.amount },
      );
      await this.transactionPurchaseRepository.findOneAndDelete({
        order_id: userTxTmp ? userTxTmp.order_id : userTx.order_id
      })
      await this.transactionTemporaryRepository.findOneAndDelete({
        order_id: userTxTmp ? userTxTmp.order_id : userTx.order_id, type: TransactionFormat.DEPOSIT
      })

      await lastValueFrom(this.orderClient.emit(UPDATE_STATUS_REFUND_EVENT, payload))
    } else if (((userTx && userTx.payment_method === PaymentMethodFormat.WALLET) || (userTxTmp && userTxTmp.payment_method === PaymentMethodFormat.WALLET)) && data.amount && data.mchtId && data.userId && data.method === PaymentMethodFormat.WALLET) {
      await this.web3Service.refund(data)
    }

  }
  // async evnetRefund(data: IRefundEvent) {
  //   console.log("refund receive", data)
  //   const userTxs = await this.transactionPurchaseRepository.find({ order_id: data.orderId })
  //   const isHasWithdraw = userTxs.some(tx => tx.type === TransactionFormat.WITHDRAW)
  //   const isHasRefund = userTxs.some(tx => tx.type === TransactionFormat.REFUND)
  //   const txDeposit = userTxs.find(tx => tx.type === TransactionFormat.DEPOSIT)

  //   if (isHasRefund && isHasWithdraw || !txDeposit) {
  //     return
  //   }
  //   const payload: IOrderStatusRefundEvent = {
  //     orderId: data.orderId
  //   }
  //   if (txDeposit.payment_method === PaymentMethodFormat.CREDIT && data.method === PaymentMethodFormat.CREDIT) {

  //     const charge = await this.omise.charges.createRefund(
  //       data.chrgId,
  //       { amount: txDeposit.amount },
  //     );
  //     // this.transactionPurchaseRepository.findOneAndDelete({
  //     //   order_id:
  //     // })
  //     await this.transactionPurchaseRepository.create({
  //       tx_id: `tx_${this.uid.stamp(15)}`,
  //       amount: txDeposit.amount,
  //       type: TransactionFormat.REFUND,
  //       order_id: txDeposit.order_id,
  //       payment_method: PaymentMethodFormat.CREDIT,
  //       user_id: txDeposit.user_id,
  //       mcht_id: txDeposit.mcht_id
  //     })
  //     await lastValueFrom(this.orderClient.emit(UPDATE_STATUS_REFUND_EVENT, payload))
  //   } else if (txDeposit.payment_method === PaymentMethodFormat.WALLET && data.amount && data.mchtId && data.userId && data.method === PaymentMethodFormat.WALLET) {
  //     await this.web3Service.refund(data)
  //   }

  // }
  // async merchantRefundCreditCard(mchtId: string, orderId: string, chrgId: string) {
  //   const userTxs = await this.transactionPurchaseRepository.find({ order_id: orderId, mcht_id: mchtId })
  //   const isHasWithdraw = userTxs.some(tx => tx.type === TransactionFormat.WITHDRAW)
  //   const isHasRefund = userTxs.some(tx => tx.type === TransactionFormat.REFUND)
  //   const txDeposit = userTxs.find(tx => tx.type === TransactionFormat.DEPOSIT)

  //   if (isHasRefund && isHasWithdraw || !txDeposit) {
  //     throw new BadRequestException("This order can't refund.")
  //   }
  //   const payload: IOrderStatusRefundEvent = {
  //     orderId: orderId
  //   }
  //   if (txDeposit.payment_method === PaymentMethodFormat.CREDIT) {

  //     const charge = await this.omise.charges.createRefund(
  //       chrgId,
  //       { amount: txDeposit.amount },
  //     );
  //     await this.transactionPurchaseRepository.create({
  //       tx_id: `tx_${this.uid.stamp(15)}`,
  //       amount: txDeposit.amount,
  //       type: TransactionFormat.REFUND,
  //       order_id: txDeposit.order_id,
  //       payment_method: PaymentMethodFormat.CREDIT,
  //       user_id: txDeposit.user_id,
  //       mcht_id: txDeposit.mcht_id
  //     })
  //     await lastValueFrom(this.orderClient.emit(UPDATE_STATUS_REFUND_EVENT, payload))
  //   } else {
  //     //for smart contract
  //   }
  // }
  // // Open shop
  // async createShopCreditCard(user_id: string, creditCardPaymentDto: CreditCardPaymentDto) {
  //   try {



  //     const { amount_, token } = creditCardPaymentDto

  //     let customer: Omise.Customers.ICustomer = undefined
  //     const user_ = await this.userRepository.findOne({ user_id })

  //     const amount = amount_ * 100 //convert amount_


  //     // TODO: save customer id in mongodb
  //     if (user_.omi_cus_id !== undefined) {
  //       customer = await this.omise.customers.update(
  //         user_.omi_cus_id,
  //         { card: token },
  //       );
  //     } else if (user_.omi_cus_id === undefined) {
  //       customer = await this.omise.customers.create({
  //         email: user_.email,
  //         description: `${user_.merchant}`,
  //         card: token
  //       });


  //       const result = await this.userRepository.findOneAndUpdate({ user_id }, { omi_cus_id: customer.id },)
  //     }
  //     // check before update omi_cus_id to user
  //     const user = await this.userRepository.findOne({ user_id })
  //     const schedule = await this.omise.customers.schedules(user.omi_cus_id);

  //     // chack merchant payment first
  //     const index = schedule.data.length > 0 ? schedule.data.length - 1 : -1
  //     const sch_on = index === -1 ? schedule.data : schedule.data[index].next_occurrences_on


  //     if (sch_on.length === 0) {

  //       // charge credit card
  //       const charge = await this.omise.charges.create({
  //         amount: amount, // 1,000 Baht
  //         currency: 'thb',
  //         customer: customer.id,
  //       });

  //       const amount_convert = charge.amount / 100;

  //       // set  date
  //       const day_of_month = parseInt(charge.created_at.substring(8, 10))
  //       const currentDate = new Date();
  //       const year = currentDate.getFullYear();
  //       const month = ((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  //       const month_ = ((currentDate.getMonth() + 2).toString().padStart(2, '0'))
  //       const day = currentDate.getDate().toString().padStart(2, '0');

  //       const start_date = `${year}-${month}-${day}`
  //       const end_date = `${year + 2}-${month}-${day}`
  //       // option end date in merchant database
  //       const end_date_credit = `${year}-${month_}-${day}`



  //       // ! schedule 1 month
  //       const schedules = await this.omise.schedules.create({
  //         every: 1,
  //         period: 'month',
  //         on: {
  //           days_of_month: [day_of_month],
  //         },
  //         start_date,
  //         end_date,
  //         charge: {
  //           customer: customer.id,
  //           amount: charge.amount,
  //           description: `${user.merchant}`
  //         }
  //       })
  //       const merchant = await this.merchantRepository.findOne({ _id: user.merchant })
  //       await this.merchantRepository.findOneAndUpdate({ mcht_id: merchant.mcht_id }, { $set: { status: MerchantStatus.OPENED, end_date: new Date(end_date_credit), amount: (merchant.amount + amount_convert) } })

  //       return charge
  //     }

  //     return "You have on payment month."
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // async refundCreditCard(chrg_id: string, amount: number) {
  //   try {
  //     const charge = await this.omise.charges.createRefund(chrg_id, { amount });
  //     console.log(charge)
  //     return charge
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }

  // }

  // async findScheduleUser(user_id: string) {
  //   try {
  //     const user = await this.userRepository.findOne({ user_id })
  //     const schedule = await this.omise.customers.schedules(user.omi_cus_id);


  //     return schedule
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // async removeCreditSchedule(user_id: string) {
  //   try {

  //     const user = await this.userRepository.findOne({ user_id })
  //     const schedule = await this.omise.customers.schedules(user.omi_cus_id);

  //     const index = schedule.data.length - 1
  //     const des_id = schedule.data[index].id
  //     const destroy = await this.omise.schedules.destroy(des_id)

  //     return destroy
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // async creditCard(user_id: string, creditCardPaymentDto: CreditCardPaymentDto) {
  //   try {

  //     const { amount_, token } = creditCardPaymentDto

  //     let customer: Omise.Customers.ICustomer = undefined
  //     const user_ = await this.userRepository.findOne({ user_id })

  //     const amount = amount_ * 100 //convert amount_

  //     // TODO: save customer id in mongodb
  //     if (user_.omi_cus_id !== undefined) {
  //       customer = await this.omise.customers.update(
  //         user_.omi_cus_id,
  //         { card: token },
  //       );
  //     } else if (user_.omi_cus_id === undefined) {
  //       customer = await this.omise.customers.create({
  //         email: user_.email,
  //         description: `${user_.merchant}`,
  //         card: token
  //       });
  //       const result = await this.userRepository.findOneAndUpdate({ user_id }, { omi_cus_id: customer.id },)
  //     }
  //     // charge credit card
  //     const charge = await this.omise.charges.create({
  //       amount: amount, // 1,000 Baht
  //       currency: 'thb',
  //       customer: customer.id,
  //     });


  //     return charge

  //   } catch (error) {
  //     console.log(error)
  //     const omiseError = error as IOmiseChargeError
  //     if (omiseError.object === "error" && omiseError.code === "invalid_charge") {
  //       throw new BadRequestException(omiseError.message)
  //     } else {
  //       throw error
  //     }

  //   }
  // }
  async withdraw(mchtId: string, userId: string, payload: WithdrawDto) {
    try {
      const aggregate = await this.transactionPurchaseRepository.aggregate([
        {
          $match: {
            mcht_id: mchtId,
            payment_method: PaymentMethodFormat.CREDIT
            // user_id: userId // Match documents with the specified merchant ID
          }
        },
        {
          $group: {
            _id: '$type',  // Group by transaction type (deposit or withdraw)
            totalAmount: { $sum: '$amount' }  // Calculate the sum of the 'amount' field
          }
        }
      ])
      if (aggregate.length <= 0) throw new BadRequestException("Insufficient balance")
      const totalDeposit = aggregate.find(item => item._id === TransactionFormat.DEPOSIT)?.totalAmount ?? 0
      const totalWithdraw = aggregate.find(item => item._id === TransactionFormat.WITHDRAW)?.totalAmount ?? 0
      const amount = totalDeposit - totalWithdraw - 50
      if (amount <= 0) throw new BadRequestException("Insufficient balance")
      // if (payload.amount > amount) throw new BadRequestException("Insufficient balance")
      const transfer = await this.omise.transfers.create({
        // amount: payload.amount * 100,
        amount: amount * 100,
        recipient: payload.recp_id,
      });
      this.logger.log(transfer)
      await this.transactionPurchaseRepository.create({
        tx_id: `tx_${this.uid.stamp(15)}`,
        // amount: payload.amount,
        amount: amount,
        mcht_id: mchtId,
        payment_method: PaymentMethodFormat.CREDIT,
        type: TransactionFormat.WITHDRAW,
        user_id: userId
      })
      return { message: "success" }
      // const transfer = await this.omise.transfers.create({
      //   amount: payload.amount * 100,
      //   recipient: payload.recp_id,
      // });
      // this.logger.log(transfer)
      // await this.transactionPurchaseRepository.create({
      //   tx_id: `tx_${this.uid.stamp(15)}`,
      //   amount: 3,
      //   mcht_id: mchtId,
      //   payment_method: PaymentMethodFormat.CREDIT,
      //   type: TransactionFormat.WITHDRAW,
      //   user_id: userId
      // })
    } catch (error) {
      console.log(error)
      throw error
    }

  }
  async getWei(priceTHB: number) {
    const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
    const rateInTHB = data.THB
    const rate = (1 * 10 ** 18) / rateInTHB
    const toWei = rate * priceTHB
    const rate2 = rateInTHB / (1 * 10 ** 18)
    const bath = toWei * rate2
    return { wei: Math.ceil(toWei), bath }
  }
  async merchantReportTotal(mchtId: string) {
    const aggregate: {
      _id: {
        type: "deposit" | "withdraw",
        payment_method: "credit" | "wallet"
      },
      totalAmount: number
    }[] = await this.transactionPurchaseRepository.aggregate([
      {
        $match: {
          mcht_id: mchtId  // Match documents with the specified merchant ID
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            payment_method: '$payment_method'
          },  // Group by transaction type (deposit or withdraw)
          totalAmount: { $sum: '$amount' }  // Calculate the sum of the 'amount' field
        }
      }
    ])

    // const data = await Promise.all(aggregate.map(async item => {
    //   if (item._id.payment_method === "wallet") {
    //     const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
    //     const rateInTHB = data.THB
    //     const rate2 = rateInTHB / (1 * 10 ** 18)
    //     const bath = item.totalAmount * rate2
    //     return {
    //       ...item,
    //       totalWei: item.totalAmount,
    //       totalEth: item.totalAmount / (1 * 10 ** 18),
    //       totalAmount: Math.ceil(bath)
    //     }
    //   }
    //   return item
    // }))
    const totalDepositCredit = aggregate.find(item => item._id.type === "deposit" && item._id.payment_method === "credit")?.totalAmount ?? 0
    const totalDepositWei = aggregate.find(item => item._id.type === "deposit" && item._id.payment_method === "wallet")?.totalAmount ?? 0
    const totalWithdrawWei = aggregate.find(item => item._id.type === "withdraw" && item._id.payment_method === "wallet")?.totalAmount ?? 0
    const totalWithdrawCredit = aggregate.find(item => item._id.type === "withdraw" && item._id.payment_method === "credit")?.totalAmount ?? 0
    let totalDepositWallet = 0
    let totalWithdrawWallet = 0
    let totalDepositEth = 0
    let amountCreditCanWithdraw = 0
    let amountWalletCanWithdraw = 0
    let amountWeiCanWithdraw = 0
    let fiftyInWei = 0
    if (totalDepositWei > 0) {
      const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
      const rateInTHB = data.THB
      const rate2 = rateInTHB / (1 * 10 ** 18)
      totalDepositWallet = Math.ceil(totalDepositWei * rate2)
      totalWithdrawWallet = Math.ceil(totalWithdrawWei * rate2)
      totalDepositEth = totalDepositWei / (1 * 10 ** 18)

      const rate = (1 * 10 ** 18) / rateInTHB
      fiftyInWei = rate * 50
    }
    amountWeiCanWithdraw = totalDepositWei - totalWithdrawWei - fiftyInWei
    amountCreditCanWithdraw = totalDepositCredit - totalWithdrawCredit - 50
    amountWalletCanWithdraw = totalDepositWallet - totalWithdrawWallet - 50
    return {
      data: {
        totalAmountDeposit: totalDepositCredit + totalDepositWallet,
        totalDepositCredit,
        totalDepositWei,
        totalDepositWallet,
        totalDepositEth,
        // totalWithdrawCredit,
        // totalWithdrawWallet,
        // totalWithdrawWei,
        totalAmountWithdraw: totalWithdrawWallet + totalWithdrawCredit,
        amountCreditCanWithdraw: amountCreditCanWithdraw < 50 ? 0 : amountCreditCanWithdraw,
        amountWalletCanWithdraw: amountWalletCanWithdraw < 50 ? 0 : amountWalletCanWithdraw,
        amountWeiCanWithdraw: amountWeiCanWithdraw <= fiftyInWei ? 0 : amountWeiCanWithdraw,
        amountEthCanWithdraw: amountWeiCanWithdraw <= fiftyInWei ? 0 : amountWeiCanWithdraw / (1 * 10 ** 18),

      }
    }
  }

  async merchantStatisticByMonth(mchtId: string) {
    try {
      const currentYear = new Date().getFullYear();

      const amountOrderMonth: {
        totalSales: number
        totalOrders: number
        month: number
        payment_method: "wallet" | "credit"
      }[] = await this.transactionPurchaseRepository.aggregate([
        {
          $match: {
            mcht_id: mchtId,
            type: "deposit",
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              payment_method: '$payment_method'
            },
            totalSales: { $sum: "$amount" },
            totalOrders: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.month": 1
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            payment_method: "$_id.payment_method",
            totalSales: 1,
            totalOrders: 1
          }
        }
      ])

      let filterWallet = amountOrderMonth.filter(data => data.payment_method === "wallet")
      const filterCredit = amountOrderMonth.filter(data => data.payment_method === "credit")
      if (filterWallet.length > 0) {
        const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
        const rateInTHB = data.THB
        const weiPerTHB = rateInTHB / (1 * 10 ** 18)
        filterWallet = filterWallet.map(data => {
          return {
            ...data,
            totalSales: Math.ceil(data.totalSales * weiPerTHB)
          }
        })
      }

      return {
        data: filterCredit.map(credit => {
          const { payment_method, ...newCredit } = credit
          const wallet = filterWallet.find(wallet => wallet.month === credit.month)
          if (wallet) {
            return {
              ...newCredit,
              totalSales: newCredit.totalSales + wallet.totalSales
            }
          }
          return {
            ...newCredit
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  async merchantWithdrawEth(userId: string, mchtId: string, payload: WithdrawEthDto) {
    try {
      const aggregate: {
        _id: "deposit" | "withdraw",
        totalAmount: number
      }[] = await this.transactionPurchaseRepository.aggregate([
        {
          $match: {
            mcht_id: mchtId,
            payment_method: PaymentMethodFormat.WALLET// Match documents with the specified merchant ID
          }
        },
        {
          $group: {
            _id: '$type',  // Group by transaction type (deposit or withdraw)
            totalAmount: { $sum: '$amount' }  // Calculate the sum of the 'amount' field
          }
        }
      ])
      const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
      const rateInTHB = data.THB
      const rate = (1 * 10 ** 18) / rateInTHB
      const fiftyInWei = rate * 50
      if (aggregate.length <= 0) throw new BadRequestException("Insufficient balance")
      const tmpTx = await this.transactionTemporaryRepository.find({ payment_method: PaymentMethodFormat.WALLET, type: TransactionFormat.WITHDRAW, mcht_id: mchtId, user_id: userId })
      const tmpTotal = tmpTx.reduce((prev, curr) => prev + curr.amount, 0)

      const totalDeposit = aggregate.find(item => item._id === TransactionFormat.DEPOSIT)?.totalAmount ?? 0
      const totalWithdraw = aggregate.find(item => item._id === TransactionFormat.WITHDRAW)?.totalAmount ?? 0
      const amount = Math.ceil(totalDeposit - totalWithdraw - fiftyInWei - tmpTotal)
      // if (payload.amount * (1 * 10 ** 18) > amount) throw new BadRequestException("Insufficient balance")
      this.logger.log(totalDeposit, totalWithdraw)
      this.logger.log("amount 1", amount)
      if (amount <= 0) throw new BadRequestException("Insufficient balance")
      await this.transactionTemporaryRepository.create({

        tx_id: `tx_${this.uid.stamp(15)}`,
        // amount: payload.amount * (1 * 10 ** 18),
        amount: amount,

        payment_method: PaymentMethodFormat.WALLET,
        user_id: userId,
        mcht_id: mchtId,
        type: TransactionFormat.WITHDRAW
      })

      //
      //add withdraw web3 here
      //
      await this.web3Service.transferToMerchant(payload.address, amount)
      this.logger.log("web3 success")
      await this.transactionTemporaryRepository.findOneAndDelete({ payment_method: PaymentMethodFormat.WALLET, type: TransactionFormat.WITHDRAW, mcht_id: mchtId, user_id: userId })
      await this.transactionPurchaseRepository.create({
        // amount: payload.amount * (1 * 10 ** 18),
        amount: amount,
        mcht_id: mchtId,
        payment_method: PaymentMethodFormat.WALLET,
        type: TransactionFormat.WITHDRAW,
        user_id: userId,
        tx_id: `tx_${this.uid.stamp(15)}`
      })
      return {
        message: "success"
      }
    } catch (error) {
      this.logger.warn(error)
      throw error
    }
  }
  async getAccountDetail(recpId: string) {
    const result = this.omise.recipients.retrieve(recpId)
    return result
  }
}
