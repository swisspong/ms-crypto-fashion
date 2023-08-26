import { Controller, Get,Post,Res,Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetUserId, Public, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantDto } from './merchants/dto/create-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(RoleFormat.MERCHANT)
  @Post()
  create(@GetUserId() userId: string, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(userId, createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() productFilter: GetProductDto) {
    return this.productsService.findAll(productFilter);
  }

  @Public()
  @Get('/merchants')
  findAllMerchant(@Query() productFilter: GetProductDto) {
    return this.productsService.findAllMerchantType(productFilter);
    // return productFilter
  }
  @MessagePattern({ cmd: 'get_product' })
  getProduct(){
    return "test"
  }

}
