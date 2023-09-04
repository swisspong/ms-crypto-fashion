import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartsService } from './carts.service';
import { GetUserId } from '@app/common/decorators';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CARTS_UPDATE_PRODUCT_EVENT } from '@app/common/constants/carts.constant';
import { ProductPayloadDataEvent } from '@app/common/interfaces/products-event.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly rmqService: RmqService,
    ) { }

  @Get()
  getCart(@GetUserId() userId: string) {
    return this.cartsService.findCartByUserId(userId);
  }
  @Post(":productId")
  create(@GetUserId() userId: string, @Param("productId") productId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(userId, productId, addToCartDto);
  }

  @Patch(':itemId')
  update(@GetUserId() userId: string, @Param('itemId') itemId: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartsService.update(userId, itemId, updateCartItemDto);
  }
  @Delete(':itemId')
  remove(@GetUserId() userId: string, @Param('itemId') itemId: string) {
    return this.cartsService.remove(userId, itemId);
  }
  @EventPattern(CARTS_UPDATE_PRODUCT_EVENT)
  async handleProductUpdateCreated(@Payload() data : ProductPayloadDataEvent, @Ctx() context: RmqContext) {
    await this.cartsService.updateCartItemEvent(data)
    this.rmqService.ack(context);
  }
}
