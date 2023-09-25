import { Body, Controller, Delete, Get, Logger, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreditCardPaymentDto } from './dto/payment-credit-card.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PAID_ORDERING_EVENT, REFUND_CREDITCARD_EVENT } from '@app/common/constants/payment.constant';
import { RmqService } from '@app/common';
import { IRefundEvent, PaidOrderingEvent } from '@app/common/interfaces/payment.event.interface';
import { IOrderStatusRefundEvent } from '@app/common/interfaces/order-event.interface';
import { Web3Service } from './web3/web3.service';


@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly rmqService: RmqService
  ) { }


  @Roles(RoleFormat.MERCHANT)
  @Post("credit")
  createCreditCard(@GetUser("merchant") merchantId: string, @Body() CreditCardPaymentDto: CreditCardPaymentDto) {
    return this.paymentsService.openShopCreditCard(merchantId, CreditCardPaymentDto);
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
