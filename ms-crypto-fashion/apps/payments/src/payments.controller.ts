import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GetUser, GetUserId, Public, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreditCardPaymentDto } from './dto/payment-credit-card.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PAID_ORDERING_EVENT, RECEIVED_ORDER_EVENT, REFUND_CREDITCARD_EVENT } from '@app/common/constants/payment.constant';
import { RmqService } from '@app/common';
import { IReceivedOrder, IRefundEvent, PaidOrderingEvent } from '@app/common/interfaces/payment.event.interface';
import { IOrderStatusRefundEvent } from '@app/common/interfaces/order-event.interface';
import { Web3Service } from './web3/web3.service';
import { WithdrawDto } from './dto/create-recipient.dto';
import { WithdrawEthDto } from './dto/withdraw-eth.dto';



@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly rmqService: RmqService
  ) { }
  @Public()
  @Get()
  check() {
    return this.paymentsService.healthCheck()
  }
  @Roles(RoleFormat.MERCHANT)
  @Post("credit")
  createCreditCard(@GetUser("merchant") merchantId: string, @Body() CreditCardPaymentDto: CreditCardPaymentDto) {
    return this.paymentsService.openShopCreditCard(merchantId, CreditCardPaymentDto);
  }
  @Post("withdraw")
  createRecipient(@GetUser("merchant") merchantId: string, @GetUserId() userId: string, @Body() dto: WithdrawDto) {
    return this.paymentsService.withdraw(merchantId, userId, dto)
  }
  @Post("withdraw/eth")
  withdrawWallet(@GetUser("merchant") merchantId: string, @GetUserId() userId: string, @Body() dto: WithdrawEthDto) {
    return this.paymentsService.merchantWithdrawEth(userId, merchantId, dto)
  }


  @Get("merchant/report")
  @Roles(RoleFormat.MERCHANT)
  merchantReprot(@GetUser("merchant") merchantId: string) {
    return this.paymentsService.merchantReportTotal(merchantId)
  }
  @Get("merchant/statistic")
  @Roles(RoleFormat.MERCHANT)
  merchantStatistic(@GetUser("merchant") mchtId: string) {
    return this.paymentsService.merchantStatisticByMonth(mchtId)
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('recipient/:recpId')
  recipientInfo(@Param("recpId") recpId: string, @GetUser("merchant") mchtId: string) {
    return this.paymentsService.getAccountDetail(recpId)
  }
  @EventPattern(RECEIVED_ORDER_EVENT)
  async handlerReceivedOrder(@Payload() data: IReceivedOrder, @Ctx() context: RmqContext) {
    this.logger.warn("Received from cron order", data)
    await this.paymentsService.receivedOrder(data)
    this.rmqService.ack(context);
  }

  @EventPattern(PAID_ORDERING_EVENT)
  async handlerOrdering(@Payload() data: PaidOrderingEvent, @Ctx() context: RmqContext) {
    this.logger.warn("Received from product service", data)
    await this.paymentsService.paidManyOrders(data)
    this.rmqService.ack(context);
  }
  @EventPattern(REFUND_CREDITCARD_EVENT)
  async handlerRefund(@Payload() data: IRefundEvent, @Ctx() context: RmqContext) {
    this.paymentsService.evnetRefund(data)
    this.rmqService.ack(context);
  }

  // @GetUser("merchant") merchantId: string,
  //   // TODO: Destroy a schedule
  //   @Roles(RoleFormat.MERCHANT)
  //   @Delete('credit')
  //   removeSchedule(@GetUserId() userId: string) {
  //     return this.paymentsService.removeCreditSchedule(userId)
  //   }


  //   // TODO: Get schedules
  //   @Roles(RoleFormat.MERCHANT)
  //   @Get('credit/month')
  //   findSchedule(@GetUserId() userId: string) {
  //     return this.paymentsService.findScheduleUser(userId)
  //   }

}
