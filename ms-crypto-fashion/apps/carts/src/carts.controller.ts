import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { GetUserId } from '@app/common/decorators';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CARTS_DELETE_ITEMS_EVENT, CARTS_UPDATE_PRODUCT_EVENT } from '@app/common/constants/carts.constant';
import { ProductPayloadDataEvent } from '@app/common/interfaces/products-event.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { DeleteManyItemsDto } from './dto/delet-many-items.dto';
import { IDeleteChktEventPayload } from '@app/common/interfaces/carts.interface';
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  private readonly logger = new Logger(CartsController.name)
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
  @Delete()
  removeMany(@GetUserId() userId: string, @Query() items: DeleteManyItemsDto) {
    return this.cartsService.removeMany(userId, items);
  }
  @EventPattern(CARTS_UPDATE_PRODUCT_EVENT)
  async handleProductUpdateCreated(@Payload() data: ProductPayloadDataEvent, @Ctx() context: RmqContext) {
    this.logger.warn("Recevied from Cart")
    await this.cartsService.updateCartItemEvent(data)
    this.rmqService.ack(context);
  }
  @EventPattern(CARTS_DELETE_ITEMS_EVENT)
  async removeChktAndItems(@Payload() data: IDeleteChktEventPayload, @Ctx() context: RmqContext) {
    this.logger.warn("Recevied from Cart")
    await this.cartsService.deleteChktAndItems(data)
    this.rmqService.ack(context);
  }
}
