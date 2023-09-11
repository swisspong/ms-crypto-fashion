import { Body, Controller, Get, Logger, Param, Post, Delete } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { GetUserId } from '@app/common/decorators';
import { OrderingDto } from './dto/ordering.dto';

@Controller('checkouts')
export class CheckoutsController {
  private readonly logger = new Logger(CheckoutsController.name)
  constructor(private readonly checkoutsService: CheckoutsService) { }
  @Post()
  checkout(@GetUserId() userId: string, @Body() createCheckoutDto: CreateCheckoutItemsDto) {
    console.log("checkout ==========================================================")
    return this.checkoutsService.createCheckoutItems(userId, createCheckoutDto)
  }
  @Get(':chktId')
  getCheckout(@Param("chktId") chktId: string) {
    this.logger.warn("getCheckout =>", chktId)
    return this.checkoutsService.getCheckout(chktId)
  }
  @Delete(':chktId')
  deleteCheckout(@GetUserId() userId: string, @Param("chktId") chktId: string) {
    return this.checkoutsService.deleteCheckout(userId, chktId)
  }

  @Post(':chktId')
  ordering(@GetUserId() userId: string,@Param('chktId') chktId: string, @Body() orderingDto: OrderingDto) {
    return this.checkoutsService.createOrder(userId,chktId, orderingDto)
  }
}
