import { Controller, Get,Post,Res,Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantDto } from './merchants/dto/create-merchant.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }

}
