import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreditCardPaymentDto } from './dto/payment-credit-card.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }

  @Roles(RoleFormat.MERCHANT)
  @Post("credit")
  createCreditCard(@GetUser("merchant") merchantId: string,@Body() CreditCardPaymentDto: CreditCardPaymentDto) {
    return this.paymentsService.openShopCreditCard(merchantId, CreditCardPaymentDto);
  }
// @GetUser("merchant") merchantId: string,
  // // TODO: Destroy a schedule
  // @Roles(RoleFormat.MERCHANT)
  // @Delete('credit')
  // removeSchedule(@GetUserId() userId: string) {
  //   return this.paymentsService.removeCreditSchedule(userId)
  // }


  // // TODO: Get schedules
  // @Roles(RoleFormat.MERCHANT)
  // @Get('credit/month')
  // findSchedule(@GetUserId() userId: string) {
  //   return this.paymentsService.findScheduleUser(userId)
  // }

}
