import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { GetUser, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantByIdDto, UpdateVariantDto } from './dto/update-variant.dto';
import { AddVariantDto } from './dto/add-variant.dto';

@Controller('products/:productId/variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) { }
  // @Roles(RoleFormat.MERCHANT)
  // @Post()
  // create(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Body() createVariantDto: CreateVariantDto) {
  //   return this.variantsService.create(merchantId, productId, createVariantDto);
  // }
  @Roles(RoleFormat.MERCHANT)
  @Post()
  addVariant(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Body() payload: AddVariantDto) {
    return this.variantsService.addVariant(merchantId, productId, payload);
  }

  @Get()
  findAll() {
    return this.variantsService.findAll();
  }

  @Roles(RoleFormat.MERCHANT)
  @Patch()
  editVariant(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Body() payload: AddVariantDto) {
    return this.variantsService.editVariant(merchantId, productId, payload);
  }
  @Roles(RoleFormat.MERCHANT)
  @Patch('advanced')
  editVariantAdvanced(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Body() payload: AddVariantDto) {
    return this.variantsService.editVariantAdvanced(merchantId, productId, payload);
  }

  // @Roles(RoleFormat.MERCHANT)
  // @Patch()
  // update(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Body() updateVariantDto: UpdateVariantDto) {
  //   return this.variantsService.update(merchantId, productId, updateVariantDto);
  // }
  @Roles(RoleFormat.MERCHANT)
  @Patch(":variantId")
  updateByVariantId(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Param("variantId") id: string, @Body() updateVariantDto: UpdateVariantByIdDto) {
    return this.variantsService.updateById(merchantId, productId, id, updateVariantDto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Delete(":vrntId")
  removeVariant(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Param('vrntId') vrntId: string) {
    return this.variantsService.deleteVariant(merchantId, productId, vrntId);
  }
  // @Roles(RoleFormat.MERCHANT)
  // @Delete()
  // remove(@GetUser("merchant") merchantId: string, @Param("productId") productId: string, @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
  // ids: string[]) {
  //   return this.variantsService.remove(merchantId, productId, ids);
  // }
}
