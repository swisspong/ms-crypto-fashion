import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartsService } from './carts.service';
import { GetUserId } from '@app/common/decorators';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Get()
  getCart(@GetUserId() userId: string) {
    return this.cartsService.findCartByUserId(userId);
  }
  @Post(":productId")
  create(@GetUserId() userId: string, @Param("productId") productId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(userId, productId, addToCartDto);
  }
}
