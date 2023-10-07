import { Controller, Body, Post,Get, Patch, Query, Param, Delete, Put } from '@nestjs/common';
import { GetUser, GetUserId, Public, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';

import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryByOwnerDto } from './dto/get-category-by-owner.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService:CategoriesService) { }
 
  @Roles(RoleFormat.MERCHANT)
  @Post()
  create(@GetUser('merchant') merchantId: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(merchantId, createCategoryDto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('/owner')
  myMerchant( @GetUser('merchant') merchantId: string, @Query() filter: GetCategoryByOwnerDto) {
    console.log(merchantId,"++++++++++++++++++++++++++")
    return this.categoriesService.findAllOnlyOwner( merchantId, filter);
  }
  @Public()
  @Get("/merchant/:id")
  findByMerchant(@Param('id') id: string, @Query() filter: GetCategoryByOwnerDto) {
    return this.categoriesService.findAllByMerchantId(id, filter);
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('/owner/:catId')
  findOneByOwner(@Param('catId') id: string, @GetUser('merchant') merchantId: string) {
    return this.categoriesService.findOneByOwner(id, merchantId);
  }
  @Roles(RoleFormat.MERCHANT)
  @Patch(':id')
  update(@Param('id') id: string, @GetUserId() userId: string, @GetUser('merchant') merchantId: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, merchantId, updateCategoryDto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUserId() userId: string, @GetUser('merchant') merchantId: string) {
    return this.categoriesService.remove(id, merchantId);
  }

  // ! Category main by admin
  @Roles(RoleFormat.ADMIN)
  @Post('web')
  createCategoryByAdmin(@GetUserId() userId: string, @Body() createCategory: CreateCategoryDto) {
    return this.categoriesService.createByAdmin(userId, createCategory)
  } 

  @Public()
  // @Roles(RoleFormat.ADMIN)
  @Get('web')
  findAllCategories(@Query('per_page') perPage: number, @Query('page') page: number){
    return this.categoriesService.findAllCategories(perPage, page)
  }
  
  @Roles(RoleFormat.ADMIN)
  @Patch('web/:id')
  updateCategoryWeb(@Param('id') id: string, @GetUserId() userId: string,  @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategoryWeb(id, userId, updateCategoryDto);
  }

  @Roles(RoleFormat.ADMIN)
  @Get('web/:id')
  findOneById(@Param('id') id: string) {
    return this.categoriesService.findOneById(id);
  }

  @Roles(RoleFormat.ADMIN)
  @Delete('web/:id')
  removeCategoryWeb(@Param('id') id: string) {
    return this.categoriesService.removeCategoryWeb(id);
  }
}
