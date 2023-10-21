import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import ShortUniqueId from 'short-unique-id';
import { CreateVariantGroupDto, GroupDto, OptionDto } from './dto/create-variant_group.dto';
import { Types } from 'mongoose';
import { Option, VariantGroup } from './schemas/variant-group.schema';
import { UpsertVariantGroupDto } from './dto/upsert-variant_group.dto';
import { UpdateVariantGroupDto } from './dto/update-variant_group.dto';
import { Variant } from '../variants/schemas/variant.schema';
import { VariantDto } from '../variants/dto/create-variant.dto';
import { MerchantsRepository } from '../merchants/merchants.repository';
import { CARTS_SERVICE, CARTS_UPDATE_PRODUCT_EVENT } from '@app/common/constants/carts.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateGroupDto } from './dto/create-group.dto';
import { MERCHANT_NOT_FOUND, OPTION_ALREADY_IN_USE, OPTION_GROUP_ALREDAY_IN_USE, OPTION_GROUP_DUPLICATE, OPTION_GROUP_NOT_EXIST, OPTION_GROUP_NOT_MATCH, OPTION_NOT_MATCH, PRODUCT_NOT_FOUND, VARIANT_ALREADY_EXIST } from '@app/common/constants/error.constant';

@Injectable()
export class VariantGroupsService {
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly merchantsRepository: MerchantsRepository,
    @Inject(CARTS_SERVICE) private readonly cartsClient: ClientProxy,
  ) { }

  async create(merchantId: string, productId: string, createVariantGroupDto: CreateVariantGroupDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new NotFoundException(MERCHANT_NOT_FOUND)
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)
    const tmpGroups = [...createVariantGroupDto.groups, ...product.groups]


    if (this.isDuplicateGroup(tmpGroups)) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
    const newVariantGroups: VariantGroup[] = [...product.groups]
    createVariantGroupDto.groups.forEach(group => {
      const vgrp = new VariantGroup()
      vgrp.name = group.name;
      vgrp.vgrp_id = `vgrp_${this.uid.stamp(15)}`;
      vgrp.options = group.options.map(option => ({ optn_id: `optn_${this.uid.stamp(15)}`, name: option.name }))
      newVariantGroups.push(vgrp)
    })

    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, { groups: newVariantGroups })

    return newProduct
  }

  async addGroup(merchantId: string, productId: string, payload: CreateGroupDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: merchant._id })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)

    //validate group name is exist
    const isExistGroup = product.groups.some(group => group.name === payload.name)
    if (isExistGroup) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
    const groups = product.groups
    groups.push(payload)
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId, merchant: merchant._id },
      {
        groups,
      }
    )
    await lastValueFrom(
      this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
        ...newProduct, merchant
      })
    )
    return {
      message: "success"
    }
  }
  async editGroup(merchantId: string, productId: string, payload: CreateGroupDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: merchant._id })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)

    //validate group name is exist
    const existGroup = product.groups.find(group => group.name === payload.name && group.vgrp_id !== payload.vgrp_id)
    if (existGroup) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
    const eGroupIndex = product.groups.findIndex(group => group.vgrp_id === payload.vgrp_id)
    if (eGroupIndex < 0) throw new BadRequestException(OPTION_GROUP_NOT_EXIST)
    product.groups[eGroupIndex].name = payload.name
    product.groups[eGroupIndex].options = payload.options
    const optionIsInUse = product.variants.some(vrnt =>
      vrnt.variant_selecteds.some(vrnts => vrnts.vgrp_id === payload.vgrp_id && !payload.options.some(optn => optn.optn_id === vrnts.optn_id))
    )
    if (optionIsInUse) throw new BadRequestException(OPTION_ALREADY_IN_USE)
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId, merchant: merchant._id },
      {
        groups: product.groups,
      }
    )
    await lastValueFrom(
      this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
        ...newProduct, merchant
      })
    )
    return {
      message: "success"
    }
  }

  async removeGroup(merchantId: string, productId: string, id: string) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: merchant._id })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)

    product.groups = product.groups.filter(group => id !== group.vgrp_id)
    const isIncludeInVariant = product.variants.some(vrnt => vrnt.variant_selecteds.some(vrnts => vrnts.vgrp_id === id))
    if (isIncludeInVariant) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
    // if (this.isDuplicateGroup(product.groups)) throw new BadRequestException("Group name is duplicate.")
    // if (this.variantIsIncludeInGroups(product.variants, product.groups) || this.isDuplicateVariant(product.variants)) {
    //   //set product is not available
    //   product.available = false
    //   product.variants.map(variant => {
    //     const variantSelectedFiltered = variant.variant_selecteds.filter(vrnt_select => {
    //       const group = product.groups.find(group => group.vgrp_id === vrnt_select.vgrp_id);
    //       if (!group) return false
    //       const option = group.options.map(option => option.optn_id === vrnt_select.optn_id)
    //       if (!option) return false
    //       return true
    //     })
    //     return { ...variant, variant_selecteds: variantSelectedFiltered }
    //   })
    //   // const newVariant = 
    // }
    product.variants = product.variants.map(variant => {
      const variantSelectedFiltered = variant.variant_selecteds.filter(vrnt_select => {
        const group = product.groups.find(group => group.vgrp_id === vrnt_select.vgrp_id);
        if (!group) return false
        const option = group.options.map(option => option.optn_id === vrnt_select.optn_id)
        if (!option) return false
        return true
      })
      return { ...variant, variant_selecteds: variantSelectedFiltered }
    })
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, {
      //available: product.available,
      groups: product.groups,
      variants: product.variants
    })

    await lastValueFrom(
      this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
        ...newProduct, merchant
      })
    )
    return {
      message: "success"
    }
  }
  async updsertDel(merchantId: string, productId: string, upsertDto: UpsertVariantGroupDto) {
    //return upsertDto
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: merchant._id })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)
    //validate is duplicate
    upsertDto.groups.map((group, gidx) => {
      const firstElementIdx = upsertDto.groups.findIndex(grp => grp.name === group.name)
      if (firstElementIdx !== gidx) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
      group.options.map((option, oidx) => {
        const firstElementIdx = group.options.findIndex(optn => optn.name === option.name)
        if (firstElementIdx !== oidx) throw new BadRequestException(OPTION_ALREADY_IN_USE)
      })
    })

    upsertDto.variants.map((variant, vidx) => {
      //is include in groups
      variant.variant_selecteds.map((variant_selected) => {
        const group = upsertDto.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
        if (!group) throw new BadRequestException(OPTION_GROUP_NOT_MATCH)
        const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
        if (!option) throw new BadRequestException(OPTION_NOT_MATCH)
      })
      //is not duplicate in save variant
      variant.variant_selecteds.map((variant_selected, vsidx) => {
        const groupIndex = variant.variant_selecteds.findIndex((variant_selected2) => variant_selected2.vgrp_id === variant_selected.vgrp_id)
        if (groupIndex !== vsidx) throw new BadRequestException(OPTION_GROUP_DUPLICATE)
        const optionIndex = variant.variant_selecteds.findIndex((variant_selected2) => variant_selected2.optn_id === variant_selected.optn_id)
        if (optionIndex !== vsidx) throw new BadRequestException(OPTION_GROUP_DUPLICATE)
      })
      //is not duplicate variant
      upsertDto.variants.map((variant2, vidx2) => {
        if (variant2.variant_selecteds.length === variant.variant_selecteds.length) {
          const isEvery = variant2.variant_selecteds.every((vrntSelcted2) => variant.variant_selecteds.find(vrntSelcted => vrntSelcted2.vgrp_id === vrntSelcted.vgrp_id && vrntSelcted2.optn_id === vrntSelcted.optn_id) ? true : false)
          if (isEvery && vidx !== vidx2) throw new BadRequestException(VARIANT_ALREADY_EXIST)
        }
      })

    })



    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId, merchant: merchant._id },
      {
        groups: upsertDto.groups as VariantGroup[], variants: upsertDto.variants as Variant[],
        // stock: 0,
        // price: 0
      }
    )

    await lastValueFrom(
      this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
        ...newProduct, merchant
      })
    )

    return newProduct


  }



  async update(merchantId: string, productId: string, updateVariantGroupDto: UpdateVariantGroupDto) {

    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchantId) })
    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND)
    product.groups = product.groups.map(group => {
      const newGroup = updateVariantGroupDto.groups.find(vgrp => vgrp.vgrp_id === group.vgrp_id)
      if (newGroup) {
        group.name = newGroup.name
        const newOptions = newGroup.options.filter(optn => !optn?.optn_id)
          .map(optn => ({ ...optn, optn_id: `uid_${this.uid.stamp(15)}` }))
        const updateOptions = newGroup.options.filter(optn => optn?.optn_id)
        const newOptns = [...updateOptions, ...newOptions]
        group.options = newOptns as Option[]


        //add new 
        return group
      } else {
        return group
      }
    })
    if (this.isDuplicateGroup(product.groups)) throw new BadRequestException(OPTION_GROUP_ALREDAY_IN_USE)
    if (this.variantIsIncludeInGroups(product.variants, product.groups) || this.isDuplicateVariant(product.variants)) {
      //set product is not available
      product.available = false
      product.variants.map(variant => {
        const variantSelectedFiltered = variant.variant_selecteds.filter(vrnt_select => {
          const group = product.groups.find(group => group.vgrp_id === vrnt_select.vgrp_id);
          if (!group) return false
          const option = group.options.map(option => option.optn_id === vrnt_select.optn_id)
          if (!option) return false
          return true
        })
        return { ...variant, variant_selecteds: variantSelectedFiltered }
      })
    }
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, {
      available: product.available,
      groups: product.groups,
      variants: product.variants
    })
    return newProduct
  }
  private variantIsIncludeInGroups(tmpVariants: (VariantDto | Variant)[], groups: VariantGroup[]) {
    let isInvalid = false
    for (let index = 0; index < tmpVariants.length; index++) {
      const element = tmpVariants[index];
      for (let j = 0; j < element.variant_selecteds.length; j++) {
        const element2 = element.variant_selecteds[j];
        isInvalid = !groups.some(group => {
          if (group.vgrp_id === element2.vgrp_id) {
            return group.options.find(option => option.optn_id === element2.optn_id) ? true : false
          } else {
            return false
          }
        })
        if (isInvalid) {
          break;
        }
      }
    }
    return isInvalid
  }
  private isDuplicateVariant(tmpVariants: (VariantDto | Variant)[]) {
    let isDuplicate = false
    for (let i = 0; i < tmpVariants.length; i++) {
      const currentTmpVaraint = tmpVariants[i]
      const index = tmpVariants.findIndex(tmpVariant => {
        return tmpVariant.variant_selecteds.every(vrnt_selected => {
          return currentTmpVaraint.variant_selecteds.find(variant_selected => {
            if (variant_selected.vgrp_id === vrnt_selected.vgrp_id || variant_selected.optn_id === vrnt_selected.optn_id) {
              return true
            } else {
              return false
            }
          }) ? true : false
        })
      })
      if (index === i) {
        isDuplicate = false
      } else {
        isDuplicate = true
        break
      }
    }
    return isDuplicate
  }
  // async remove(merchantId: string, productId: string, ids: string[]) {
  //   const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchantId) })
  //   if (!product) throw new NotFoundException("Product not found.")
  //   product.groups = product.groups.filter(group => ids.find(id => id === group.vgrp_id) ? false : true)
  //   // if (this.isDuplicateGroup(product.groups)) throw new BadRequestException("Group name is duplicate.")
  //   if (this.variantIsIncludeInGroups(product.variants, product.groups) || this.isDuplicateVariant(product.variants)) {
  //     //set product is not available
  //     product.available = false
  //     product.variants.map(variant => {
  //       const variantSelectedFiltered = variant.variant_selecteds.filter(vrnt_select => {
  //         const group = product.groups.find(group => group.vgrp_id === vrnt_select.vgrp_id);
  //         if (!group) return false
  //         const option = group.options.map(option => option.optn_id === vrnt_select.optn_id)
  //         if (!option) return false
  //         return true
  //       })
  //       return { ...variant, variant_selecteds: variantSelectedFiltered }
  //     })
  //     // const newVariant = 
  //   }
  //   const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, {
  //     available: product.available,
  //     groups: product.groups,
  //     variants: product.variants
  //   })

  //   return newProduct
  // }


  isDuplicateGroup(tmpGroups: (GroupDto | VariantGroup)[]) {
    let isDuplicate = false
    const tmpOptions: (Option | OptionDto)[] = []
    for (let i = 0; i < tmpGroups.length; i++) {
      const currentTmpGroup = tmpGroups[i]
      tmpOptions.push(...currentTmpGroup.options)
      const index = tmpGroups.findIndex(tmpGroup => tmpGroup.name === currentTmpGroup.name)
      if (index === i) {
        isDuplicate = false
      } else {
        isDuplicate = true
        break
      }
    }
    if (isDuplicate) {
      return isDuplicate
    } else {
      return this.isDuplicateOption(tmpOptions)
    }
  }
  isDuplicateOption(tmpOptions: (Option | OptionDto)[]) {
    let isDuplicate = false;
    for (let i = 0; i < tmpOptions.length; i++) {
      const currentTmpOption = tmpOptions[i]
      const index = tmpOptions.findIndex(tmpOption => tmpOption.name === currentTmpOption.name)
      if (index === i) {
        isDuplicate = false
      } else {
        isDuplicate = true
        break
      }
    }
    if (isDuplicate) {
      throw new BadRequestException(OPTION_ALREADY_IN_USE)
    }
    return isDuplicate
  }
}
