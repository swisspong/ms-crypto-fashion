import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query } from '@nestjs/common';
import { VariantGroupsService } from './variant_groups.service';
import { GetUser, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { UpsertVariantGroupDto } from './dto/upsert-variant_group.dto';
import { UpdateVariantGroupDto } from './dto/update-variant_group.dto';

@Controller('products/:productId/variant_groups')
export class VariantGroupsController {
  constructor(private readonly variantGroupsService: VariantGroupsService) {}
  @Roles(RoleFormat.MERCHANT)
  @Post()
  create(@GetUser('merchant') merchantId: string, @Param('productId') productId: string, @Body() createVariantGroupDto: UpsertVariantGroupDto) {
    return this.variantGroupsService.updsertDel(merchantId, productId, createVariantGroupDto);
  }
  @Get()
  findAll() {
    return this.variantGroupsService.findAll();
  }
  @Roles(RoleFormat.MERCHANT)
  @Patch()
  update(@GetUser('merchant') merchantId: string, @Param('productId') productId: string, @Body() updateVariantGroupDto: UpdateVariantGroupDto) {
    return this.variantGroupsService.update(merchantId, productId, updateVariantGroupDto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Delete()
  remove(@GetUser('merchant') merchantId: string, @Param('productId') productId: string, @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
  ids: string[]) {
    return this.variantGroupsService.remove(merchantId, productId, ids);
  }
}
