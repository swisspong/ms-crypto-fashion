import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { ProductsRepository } from '../products.repository';
import { CreateVariantDto, VariantDto } from './dto/create-variant.dto';
import { Types } from 'mongoose';
import { Variant } from './schemas/variant.schema';
import { UpdateVariantByIdDto, UpdateVariantDto } from './dto/update-variant.dto';
import { VariantGroup } from '../variant_groups/schemas/variant-group.schema';
import { MerchantsRepository } from '../merchants/merchants.repository';

@Injectable()
export class VariantsService {
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly merchantRepository: MerchantsRepository
  ) { }

  async create(merchantId: string, productId: string, createVariantDto: CreateVariantDto) {
    const merchant = await this.merchantRepository.findOne({mcht_id: merchantId})
    if (!merchant)  throw new NotFoundException("Merchant not found.")
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) })
    if (!product) throw new NotFoundException("Product not found.")
    if (this.isVariantInvalid(createVariantDto.variants, product.groups)) throw new NotFoundException("Variant not found.")
    const tmpVariants = [...createVariantDto.variants, ...product.variants]

    if (this.isDuplicateVariant(tmpVariants)) throw new BadRequestException("Variant is duplicate.")
    const newVariants: Variant[] = [...product.variants]
    createVariantDto.variants.forEach(variant => {
      const vrnt = new Variant()
      vrnt.price = variant.price;
      vrnt.vrnt_id = `vrnt_${this.uid.stamp(15)}`;
      vrnt.variant_selecteds = variant.variant_selecteds
      product.groups
      newVariants.push(vrnt)
    })
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, { variants: newVariants })

    return newProduct
  }



  findAll() {
    return `This action returns all variants`;
  }

  findOne(merchantId: string, productId: string) {
    return `This action returns a #${merchantId} variant`;
  }

  async update(merchantId: string, productId: string, updateVariantDto: UpdateVariantDto) {
    const merchant = await this.merchantRepository.findOne({mcht_id: merchantId})
    if (!merchant)  throw new NotFoundException("Merchant not found.")
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) })
    if (!product) throw new NotFoundException("Product not found.")
    product.variants.map(variant => {
      const newVariant = updateVariantDto.variants.find(vgrp => vgrp.vrnt_id === variant.vrnt_id)
      if (newVariant) {
        variant.price = newVariant.price
        variant.variant_selecteds = newVariant.variant_selecteds
        //add new
        return variant
      } else {
        return variant
      }
    })
    if (this.isVariantInvalid(product.variants, product.groups)) throw new NotFoundException("Variant not found.")
    if (this.isDuplicateVariant(product.variants)) throw new BadRequestException("Variant is duplicate.")
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, { variants: product.variants })
    return newProduct
  }
  async updateById(merchantId: string, productId: string, variantId: string, updateVarianByIdtDto: UpdateVariantByIdDto) {

    // TODO: Find merchant 
    const merchant = await this.merchantRepository.findOne({mcht_id: merchantId})
    if (!merchant)  throw new NotFoundException("Merchant not found.")
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) })
    if (!product) throw new NotFoundException("Product not found.")

    if (product.groups.length <= 0 || product.variants.length <= 0) throw new BadRequestException("The product has no options.")

    const newVariantIndex = product.variants.findIndex(variant => variant.vrnt_id === variantId)
    if (newVariantIndex < 0) throw new NotFoundException("Variant not found.")
    product.variants[newVariantIndex].price = updateVarianByIdtDto.price
    product.variants[newVariantIndex].stock = updateVarianByIdtDto.stock
    product.variants[newVariantIndex].variant_selecteds = updateVarianByIdtDto.variant_selecteds
    product.variants[newVariantIndex].image_url = updateVarianByIdtDto.image_url

    product.groups.map((group, gidx) => {
      const firstElementIdx = product.groups.findIndex(grp => grp.name === group.name)
      if (firstElementIdx !== gidx) throw new BadRequestException("Group name is duplicate.")
      group.options.map((option, oidx) => {
        const firstElementIdx = group.options.findIndex(optn => optn.name === option.name)
        if (firstElementIdx !== oidx) throw new BadRequestException("Option name is duplicate.")
      })
    })

    product.variants.map((variant, vidx) => {
      //is include in groups
      variant.variant_selecteds.map((variant_selected) => {
        const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
        if (!group) throw new BadRequestException("Group not match.")
        const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
        if (!option) throw new BadRequestException("Option not match.")
      })
      //is not duplicate in save variant
      variant.variant_selecteds.map((variant_selected, vsidx) => {
        const groupIndex = variant.variant_selecteds.findIndex((variant_selected2) => variant_selected2.vgrp_id === variant_selected.vgrp_id)
        if (groupIndex !== vsidx) throw new BadRequestException("Group is duplicate in variant.")
        const optionIndex = variant.variant_selecteds.findIndex((variant_selected2) => variant_selected2.optn_id === variant_selected.optn_id)
        if (optionIndex !== vsidx) throw new BadRequestException("Group is duplicate in variant.")
      })
      //is not duplicate variant
      product.variants.map((variant2, vidx2) => {
        if (variant2.variant_selecteds.length === variant.variant_selecteds.length) {
          const isEvery = variant2.variant_selecteds.every((vrntSelcted2) => variant.variant_selecteds.find(vrntSelcted => vrntSelcted2.vgrp_id === vrntSelcted.vgrp_id && vrntSelcted2.optn_id === vrntSelcted.optn_id) ? true : false)
          if (isEvery && vidx !== vidx2) throw new BadRequestException("Variant is duplicate.")
        }
      })

    })

    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) }, { variants: product.variants })
    return newProduct
    // if (this.isVariantInvalid(product.variants, product.groups)) throw new NotFoundException("Variant not found.")
    // if (this.isDuplicateVariant(product.variants)) throw new BadRequestException("Variant is duplicate.")
    // const newVariantIndex = product.variants.findIndex(variant => variant.vrnt_id === variantId)
    // product.variants[newVariantIndex].price = updateVarianByIdtDto.price
    // product.variants[newVariantIndex].variant_selecteds = updateVarianByIdtDto.variant_selecteds
    // product.variants[newVariantIndex].image_url = updateVarianByIdtDto.image_url
    // if (this.isVariantInvalid(product.variants, product.groups)) throw new NotFoundException("Variant not found.")
    // if (this.isDuplicateVariant(product.variants)) throw new BadRequestException("Variant is duplicate.")
    // const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, { variants: product.variants })
    // return newProduct
  }

  async remove(merchantId: string, productId: string, ids: string[]) {
    const merchant = await this.merchantRepository.findOne({mcht_id: merchantId})
    if (!merchant)  throw new NotFoundException("Merchant not found.")
    const product = await this.productsRepository.findOne({ prod_id: productId, merchant: new Types.ObjectId(merchant._id) })
    if (!product) throw new NotFoundException("Product not found.")
    product.variants = product.variants.filter(variant => ids.find(id => id === variant.vrnt_id) ? false : true)
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: productId }, { variants: product.variants })
    return newProduct
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
  private isVariantInvalid(tmpVariants: (VariantDto | Variant)[], groups: VariantGroup[]) {
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

}
