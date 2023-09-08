import { Controller, Get, Param, Post } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { GetUserId } from '@app/common/decorators';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) { }
  @Post()
  checkout(@GetUserId() userId: string, createCheckoutDto: CreateCheckoutItemsDto) {
    return this.checkoutsService.createCheckoutItems(userId, createCheckoutDto)
  }
  @Get('/:id')
  getCheckout(@Param(':id') id: string) {
    return this.checkoutsService.getCheckout(id)
  }

  @Post('/:id')
  ordering(@Param('id') id: string) {
    return this.checkoutsService
  }
}
