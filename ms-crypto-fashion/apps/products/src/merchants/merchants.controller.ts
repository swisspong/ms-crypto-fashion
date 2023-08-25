import { Controller, Body, Post, Res,Get } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Merchant')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) { }
  @Roles(RoleFormat.USER)
  @Post("/start")
  create(@Res({ passthrough: true }) res, @GetUserId() userId: string, @GetUser('role') role: string, @GetUser('permission') permission: string[], @GetUser('merchant') merchant: string | undefined, @Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.createStarterMerchant(userId, role, merchant, permission, createMerchantDto, res);
  }
  @Get()
  getHello() {



    
    return "hello"
  }
}
