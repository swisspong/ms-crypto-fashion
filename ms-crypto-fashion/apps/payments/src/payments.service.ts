import { Inject, Injectable } from '@nestjs/common';
import * as Omise from 'omise';
import { CreditCardPaymentDto } from './dto/payment-credit-card.dto';
import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { PaidOrderingEvent, UpdateChargeMerchant } from '@app/common/interfaces/payment.event.interface';
import { CHARGE_MONTH_EVENT, PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { ORDER_SERVICE, UPDATE_ORDER_STATUS_EVENT } from '@app/common/constants/order.constant';
import { IUpdateOrderStatusEventPayload } from '@app/common/interfaces/order-event.interface';
import { PaymentMethodFormat } from '@app/common/enums';

@Injectable()
export class PaymentsService {

  private readonly omise: Omise.IOmise = Omise({
    publicKey: process.env.OMISE_PUBLIC_KEY,
    secretKey: process.env.OMISE_SECRET_KEY,
  })

  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  // TODO: charge for open shop
  async openShopCreditCard(user_id: string, creaditCardPaymentDto: CreditCardPaymentDto) {
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

      const data: UpdateChargeMerchant = {
        amount: amount_convert,
        end_date: end_date_credit,
        mcht_id: user_id
      }
      console.log(data);

      await lastValueFrom(
        this.productClient.emit(CHARGE_MONTH_EVENT, {
          ...data
        })
      )

      return charge
    } catch (error) {
      console.log(error)
      throw error
    }
  }


  async paidManyOrders(data: PaidOrderingEvent) {
    const { amount_, token, orderIds, chkt_id, user_id, payment_method } = data

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
        orderIds: orderIds,
        sucess: true,
        chargeId: charge.id
      }
      await lastValueFrom(this.orderClient.emit(UPDATE_ORDER_STATUS_EVENT, payload))
    }else{
      
    }

  }
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
}
