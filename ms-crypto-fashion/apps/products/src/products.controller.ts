import { Controller, Get, Post, Res, Body, Query, Logger, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetUser, GetUserId, Public, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantDto } from './merchants/dto/create-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { GetProductNoTypeSerchatDto } from './dto/get-product-no-type-search.dto';
import { GetProductStoreDto } from './dto/get-product-store.dto';
import { StoreQueryDto } from './dto/store-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCTS_ORDERING_EVENT } from '@app/common/constants/products.constant';
import { OrderingEventPayload } from '@app/common/interfaces/order-event.interface';
import { RmqService } from '@app/common';
import { IProductOrderingEventPayload } from '@app/common/interfaces/products-event.interface';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name)
  constructor(private readonly productsService: ProductsService, private readonly rmqService: RmqService,) { }

  @Roles(RoleFormat.MERCHANT)
  @Post()
  create(@GetUserId() userId: string, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(userId, createProductDto);
  }

  @Public()
  @Get()
  userGetAllProducts(@Query() productFilter: GetProductDto) {
    return this.productsService.findAllProducts(productFilter);
  }
  // @Public()
  // @Get()
  // findAll(@Query() productFilter: GetProductDto) {
  //   return this.productsService.findAll(productFilter);
  // }

  @Public()
  @Get('/merchants')
  findAllMerchant(@Query() productFilter: GetProductDto) {
    return this.productsService.findAllMerchantsProducts(productFilter);
    // return productFilter
  }
  // @Public()
  // @Get('/merchants')
  // findAllMerchant(@Query() productFilter: GetProductDto) {
  //   return this.productsService.findAllMerchantType(productFilter);
  //   // return productFilter
  // }

  @Public()
  @Get("/merchant/:id")
  findByMerchant(@Param('id') id: string, @Query() productFilter: GetProductNoTypeSerchatDto) {
    return this.productsService.findAllProductInMerchant(id, productFilter);
    // return productFilter
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('/owner')
  myMerchant(@GetUserId() userId: string, @GetUser('merchant') merchantId: string, @Query() productFilter: GetProductStoreDto) {
    return this.productsService.myMerchant(userId, merchantId, productFilter);
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('/owner/:id')
  findOneByOwner(@Param('id') id: string, @GetUser('merchant') merchantId: string, @Query() productFilter: StoreQueryDto) {
    return this.productsService.findOneByOwner(id, merchantId, productFilter);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @MessagePattern(PRODUCTS_ORDERING_EVENT)
  async handlerOrdering(@Payload() data: IProductOrderingEventPayload, @Ctx() context: RmqContext) {
    this.logger.warn("Received message from ordering")
    await this.productsService.cutStock(data)
    this.rmqService.ack(context);
  }




  @Roles(RoleFormat.MERCHANT)
  @Patch(':id')
  update(@Param('id') id: string, @GetUserId() userId: string, @GetUser('merchant') merchantId: string, @Body() updateCategoryDto: UpdateProductDto) {
    return this.productsService.update(id, merchantId, updateCategoryDto);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @Roles(RoleFormat.MERCHANT)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUserId() userId: string, @GetUser('merchant') merchantId: string) {
    return this.productsService.remove(id, merchantId);
  }


  // TODO:  product for admin


  @Roles(RoleFormat.ADMIN)
  @Delete(':id/advanced')
  removeByAdmin(@Param('id') id: string) {
    return this.productsService.removeByAdmin(id);
  }




  @MessagePattern({ cmd: 'get_product' })
  async getProduct(@Payload() data: { prod_id: string }) {
    const product = await this.productsService.findOne(data.prod_id)
    this.logger.warn("result=>", product)
    return { data: product }
  }
  @MessagePattern({ cmd: 'check_product_list' })
  async getProductList(@Payload() data: {
    items: {
      quantity: number
      vrnt_id?: string
      prod_id: string
    }[]
  }) {
    const products = await this.productsService.checkAllByIdList(data.items)
    this.logger.warn("result=>", products)
    return { data: products }
  }

}
