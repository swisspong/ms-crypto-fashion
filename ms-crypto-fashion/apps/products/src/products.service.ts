import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from './categories/categories.repository';
import { CategoryWebRepository } from './categories/category-web.repository';
import { MerchantsRepository } from './merchants/merchants.repository';
import { GetProductDto } from './dto/get-product.dto';
import { SearchType } from './dto/get-product-base.dto';
import { GetProductNoTypeSerchatDto } from './dto/get-product-no-type-search.dto';
import { MerchantStatus, PaymentMethodFormat } from '@app/common/enums';
import { GetProductStoreDto } from './dto/get-product-store.dto';
import { Product } from './schemas/product.schema';
import { StoreQueryDto } from './dto/store-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';
import { CARTS_DELETE_ITEMS_EVENT, CARTS_SERVICE, CARTS_UPDATE_PRODUCT_EVENT } from '@app/common/constants/carts.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IProduct, OrderingEventPayload } from '@app/common/interfaces/order-event.interface';
import { ProductsUtilService } from '@app/common/utils/products/products-util.service';
import { CartsUtilService } from '@app/common/utils/carts/carts-util.service';
import { PaidOrderingEvent } from '@app/common/interfaces/payment.event.interface';
import { IProductOrderingEventPayload } from '@app/common/interfaces/products-event.interface';
import { PAID_ORDERING_EVENT, PAYMENT_SERVICE } from '@app/common/constants/payment.constant';
import { IDeleteChktEventPayload } from '@app/common/interfaces/carts.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoriesWebRepository: CategoryWebRepository,
    private readonly merchantsRepository: MerchantsRepository,
    private readonly productsUtilService: ProductsUtilService,
    private readonly cartsUtilService: CartsUtilService,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
    @Inject(CARTS_SERVICE) private readonly cartsClient: ClientProxy,
  ) { }
  async create(userId: string, createProductDto: CreateProductDto) {
    const merchant = await this.merchantsRepository.findOne({ user_id: userId })
    if (!merchant) throw new ForbiddenException()
    const existProduct = await this.productsRepository.findOne({ merchant: merchant._id, name: createProductDto.name })
    if (existProduct) throw new BadRequestException("Product is exist.")

    console.log(createProductDto.categories.map(item => item.cat_id));


    const categories = await this.categoriesRepository.find({
      mcht_id: merchant.mcht_id,
      cat_id: {
        $in: createProductDto.categories.map(item => item.cat_id)
      }
    })
    console.log("categories", categories)
    const categoriesWeb = await this.categoriesWebRepository.find({

      catweb_id: {
        $in: createProductDto.categories_web.map(item => item.cat_id)
      }
    })
    // console.log(categories, createProductDto.categories, createProductDto.categories.map(item => item.cat_id))
    if (categories.length !== createProductDto.categories.length) throw new BadRequestException("Invalid Category")
    if (categoriesWeb.length !== createProductDto.categories_web.length) throw new BadRequestException("Invalid Category")
    const newProduct = await this.productsRepository.create({
      prod_id: `prod_${this.uid.stamp(15)}`, ...createProductDto, merchant: merchant._id, image_urls: createProductDto.image_urls.map(image => image.url),
      categories: categories.map(cat => cat._id),
      categories_web: categoriesWeb.map(cat => cat._id),
      groups: [],
      variants: [],
    })
    return newProduct;
  }
  async findAll(productFilter: GetProductDto) {
    console.log(productFilter)
    // const type_search = productFilter.type_search === SearchType.MERCHANT ? "merchant.name" : "name"

    let sort = {}
    if (productFilter.sort) {
      const sortArr = productFilter.sort.split(",")
      if (sortArr.length > 1) {

        sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

      }
    }
    console.log(sort)
    // return this.productsRepository.find({})
    const total = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $lookup: {
          from: "categorywebs",
          localField: "categories_web",
          foreignField: "_id",
          as: "categories_web"
        },
      },
      {
        $match: {
          available: true,
          // [type_search]: { $regex: productFilter.search, $options: 'i' },
          ...(productFilter.cat_ids ? { 'categories_web.catweb_id': { $all: productFilter.cat_ids } } : undefined),
          name: { $regex: productFilter.search, $options: 'i' },
          "merchant.status": "opened"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const product = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $lookup: {
          from: "categorywebs",
          localField: "categories_web",
          foreignField: "_id",
          as: "categories_web"
        },
      },
      {
        $match: {
          available: true,
          name: { $regex: productFilter.search, $options: "i" },
          ...(productFilter.cat_ids ? { 'categories_web.catweb_id': { $all: productFilter.cat_ids } } : undefined),
          // [type_search]: { $regex: productFilter.search, $options: "i" },
          "merchant.status": "opened"
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "merchant.__v": 0,
          "merchant._id": 0
        }
      },
      {
        ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
      },
      {
        $skip: (productFilter.page - 1) * productFilter.per_page,
      },
      {
        $limit: productFilter.per_page
      },


    ])
    return {
      data: product,
      page: productFilter.page,
      per_page: productFilter.per_page,
      total: total[0]?.count || 0,
    }



  }

  async findAllMerchantType(productFilter: GetProductDto) {
    console.log(productFilter)
    const type_search = productFilter.type_search === SearchType.MERCHANT ? "merchant.name" : "name"

    let sort = {}
    if (productFilter.sort) {
      const sortArr = productFilter.sort.split(",")
      if (sortArr.length > 1) {

        sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

      }
    }
    console.log(sort)
    const total = await this.merchantsRepository.aggregate([
      {
        $match: {
          status: "opened",
          ...(type_search === "merchant.name" ? { name: { $regex: productFilter.search, $options: "i" } } : undefined),
        }
      },
      {
        $lookup: {
          from: "products",
          let: { merchantId: '$_id' },
          pipeline: [

            {
              $match: {
                $expr: { $eq: ['$merchant', '$$merchantId'] },
                ...(type_search === "name" ? { name: { $regex: productFilter.search, $options: "i" } } : undefined),
                available: true
              },
            },
            {
              $lookup: {
                from: "categorywebs",
                localField: "categories_web",
                foreignField: "_id",
                as: "categories_web",
              },
            },
            {
              $match: {
                ...(productFilter.cat_ids && productFilter.cat_ids.length > 0 ? {
                  "categories_web.catweb_id": {
                    $all: productFilter.cat_ids
                  }
                } : undefined)
              }
            }, {
              $limit: 5
            }

          ],
          as: "products"
        }
      }, {
        $match: {
          $expr: { $gt: [{ $size: '$products' }, 0] },
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const merchants = await this.merchantsRepository.aggregate([
      {
        $match: {
          status: "opened",
          ...(type_search === "merchant.name" ? { name: { $regex: productFilter.search, $options: "i" } } : undefined),
        }
      },
      {
        $lookup: {
          from: "products",
          let: { merchantId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$merchant', '$$merchantId'] },
                ...(type_search === "name" ? { name: { $regex: productFilter.search, $options: "i" } } : undefined),
                // ...(productFilter.cat_ids ? { 'categories.cat_id': { $all: productFilter.cat_ids } } : undefined),
                available: true
              },
            },
            {
              $lookup: {
                from: "categorywebs",
                localField: "categories_web",
                foreignField: "_id",
                as: "categories_web",
              },
            },
            {
              $match: {
                ...(productFilter.cat_ids && productFilter.cat_ids.length > 0 ? {
                  "categories_web.catweb_id": {
                    $all: productFilter.cat_ids
                  }
                } : undefined)
              }
            },
            {
              $limit: 5
            }
          ],
          as: "products"
        }
      }, {
        $match: {
          $expr: { $gt: [{ $size: '$products' }, 0] },
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "products.__v": 0,
          "products._id": 0
        }
      },
      {
        ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
      },
      {
        $skip: (productFilter.page - 1) * productFilter.per_page,
      },
      {
        $limit: productFilter.per_page
      },


    ])
    return {
      data: merchants,
      page: productFilter.page,
      per_page: productFilter.per_page,
      total: total[0]?.count || 0,
    }



  }
  async findAllProductInMerchant(mchtId: string, productFilter: GetProductNoTypeSerchatDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: mchtId, status: MerchantStatus.OPENED })
    if (!merchant) throw new NotFoundException("Not found merchant.")
    // console.log(merchant)
    let sort = {}
    if (productFilter.sort) {
      const sortArr = productFilter.sort.split(",")
      if (sortArr.length > 1) {

        sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

      }
    }
    console.log(sort)
    console.log(productFilter)
    const total = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $match: {
          available: true,
          ...(productFilter.cat_ids ? { 'categories.cat_id': { $all: productFilter.cat_ids } } : undefined),
          "merchant.mcht_id": mchtId,
          name: { $regex: productFilter.search, $options: 'i' },
          "merchant.status": "opened"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const product = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $match: {
          available: true,
          ...(productFilter.cat_ids ? { 'categories.cat_id': { $all: productFilter.cat_ids } } : undefined),

          // 'categories.cat_id': { $all: productFilter.cat_ids },
          "merchant.mcht_id": mchtId,
          name: { $regex: productFilter.search, $options: "i" },
          "merchant.status": "opened",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "merchant": 0,
          "categories.__v": 0,
          "categories._id": 0
        }
      },
      {
        ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
      },
      {
        $skip: (productFilter.page - 1) * productFilter.per_page,
      },
      {
        $limit: productFilter.per_page
      },
    ])
    return {
      data: product,
      page: productFilter.page,
      per_page: productFilter.per_page,
      total: total[0]?.count || 0,
    }

  }

  async myMerchant(userId: string, merchantId: string, productFilter: GetProductStoreDto) {
    // const user = await this.usersRepository.findOne({ user_id: userId, merchant: new Types.ObjectId(merchantId) })
    console.log(merchantId)
    let sort = {}
    if (productFilter.sort) {
      const sortArr = productFilter.sort.split(",")
      if (sortArr.length > 1) {

        sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

      }
    }
    console.log(sort)
    const total = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $match: {
          ...(productFilter.cat_ids ? { 'categories.cat_id': { $all: productFilter.cat_ids } } : undefined),
          // 'categories.cat_id': { $all: productFilter.cat_ids },
          ...(productFilter.store_front ? { available: true } : undefined),
          "merchant.mcht_id": merchantId,
          name: { $regex: productFilter.search, $options: 'i' },
          //  "merchant.status": "opened"
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const product = await this.productsRepository.aggregate([
      {
        $lookup: {
          from: "merchants",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        },
      },
      {
        $match: {
          ...(productFilter.cat_ids ? { 'categories.cat_id': { $all: productFilter.cat_ids } } : undefined),

          ...(productFilter.store_front ? { available: true } : undefined),
          "merchant.mcht_id": merchantId,
          name: { $regex: productFilter.search, $options: "i" },
          // "merchant.status": "opened",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "merchant": 0,
          //"categories":0,
          "categories.__v": 0,
          "categories._id": 0
        }
      },
      {
        ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
      },
      {
        $skip: (productFilter.page - 1) * productFilter.per_page,
      },
      {
        $limit: productFilter.per_page
      },
    ])
    return {
      data: product,
      page: productFilter.page,
      per_page: productFilter.per_page,
      total: total[0]?.count || 0,
      total_page: Math.ceil((total[0]?.count || 0) / productFilter.per_page)
    }
  }

  async findOneByOwner(id: string, merchantId: string, productFilter: StoreQueryDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    // const product = await this.productsRepository.findOne({ prod_id: id, merchant: new Types.ObjectId(merchantId), ...(productFilter.store_front ? { available: true } : undefined) }, ["categories", "merchants"])
    // return product
    let product = await this.productsRepository.findOnePopulate({ prod_id: id, merchant: merchant._id, ...(productFilter.store_front ? { available: true } : undefined) },
      [
        {
          model: "Merchant",
          path: 'merchant',
          // populate: {
          //   model: 'Merchant',
          //   path: 'merchant',
          // }
        },
        {
          model: "Category",
          path: 'categories',
          // populate: {
          //   model: 'Merchant',
          //   path: 'merchant',
          // }
        },
        {
          model: "CategoryWeb",
          path: 'categories_web',
          // populate: {
          //   model: 'Merchant',
          //   path: 'merchant',
          // }
        },
      ]
    ) as Product
    return product
  }
  async findOne(prodId: string) {
    //fix get product relate merchant
    const product = await this.productsRepository.findOnePopulate({ prod_id: prodId }, ['merchant'])
    // if (product.length <= 0) throw new NotFoundException()
    return product
    // return `This action returns a #${id} product`;
  }
  async update(prodId: string, merchantId: string, updateProductDto: UpdateProductDto) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new NotFoundException("Merchant not found.")
    const product = await this.productsRepository.findOne({ prod_id: prodId, merchant: merchant._id })
    if (!product) throw new NotFoundException("Prodct not found.")

    const existProduct = await this.productsRepository.findOne({ prod_id: { $not: { $eq: prodId } }, name: updateProductDto.name, merchant: merchant._id })
    // const existProduct = await this.productsRepository.findOnePopulate({ prod_id: { $not: { $eq: prodId } }, name: updateProductDto.name }, [{ path: "merchant", match: { mcht_id: merchantId } }])
    // const existProduct = await this.productsRepository.findOne({ prod_id: { $not: { $eq: prodId } }, name: updateProductDto.name })

    if (existProduct) throw new BadRequestException("Product name is existing.")
    const categories = await this.categoriesRepository.find({
      merchant: merchant._id,
      cat_id: {
        $in: updateProductDto.categories.map(item => item.cat_id)
      }
    })
    const categoriesWeb = await this.categoriesWebRepository.find({
      catweb_id: {
        $in: updateProductDto.categories_web.map(item => item.cat_id)
      }
    })
    if (categories.length !== updateProductDto.categories.length) throw new BadRequestException("Invalid Category")
    if (categoriesWeb.length !== updateProductDto.categories_web.length) throw new BadRequestException("Invalid Category")
    const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: product.prod_id, merchant: product.merchant }, {
      ...updateProductDto,
      image_urls: updateProductDto.image_urls.map(image => image.url),
      categories: categories.map(cat => cat._id),
      // categories_web: categories.map(cat => (cat as CategoryDocument)._id),
      categories_web: categoriesWeb.map(cat => cat._id),

    })
    this.logger.warn("emit from product to carts")
    await lastValueFrom(
      this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
        ...newProduct, merchant
      })
    )
    return newProduct

  }
  async checkAllByIdList(items: {
    quantity: number
    vrnt_id?: string
    prod_id: string
  }[]) {
    const products = await this.productsRepository.find({ 'prod_id': { '$in': items.map(item => item.prod_id) } })
    const checkProducts = await Promise.all(items.map(async item => {

      const product = products.find(product => item.prod_id === product.prod_id)
      if (!product) return { error: true }
      if (!product.available) return { error: true }
      const merchant = await this.merchantsRepository.findOne({ _id: product.merchant })
      if (merchant.status !== MerchantStatus.OPENED) return { error: true }
      if (item.vrnt_id) {
        const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
        if (!variant) return { error: true }
        const isIncludeEveryGroupAndOption = variant.variant_selecteds.every(vrnts => {
          const group = product.groups.find(group => group.vgrp_id === vrnts.vgrp_id)
          if (!group) return false
          const option = group.options.find(option => option.optn_id === vrnts.optn_id)
          if (!option) return false
          return true
        })
        if (!isIncludeEveryGroupAndOption) return { error: true }
        if (item.quantity > variant.stock) return { error: true }

      } else {
        if (product.variants.length > 0 || product.groups.length > 0) return { error: true }
        if (item.quantity > product.stock) return { error: true }
      }
      return { ...product, merchant }
    }))
    return checkProducts.filter(item => {
      if (typeof item === 'object' && 'error' in item && typeof item.error === 'boolean') {
        return false
      }
      return true
    })
  }

  async remove(catId: string, merchantId: string) {
    const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
    if (!merchant) throw new ForbiddenException()
    const product = await this.productsRepository.findOne({ prod_id: catId, merchant: merchant._id })
    if (!product) throw new NotFoundException("Category not found.")
    return await this.productsRepository.findOneAndDelete({ prod_id: catId, merchant: merchant._id })
  }
  async removeByAdmin(prod_id: string) {
    const product = await this.productsRepository.findOne({ prod_id })
    if (!product) throw new NotFoundException("Category not found.")
    return await this.productsRepository.findOneAndDelete({ prod_id })
  }

  async cutStock(data: IProductOrderingEventPayload) {
    await Promise.all(data.items.map(async (item) => {
      const newStock = -item.quantity
      const currentProduct = await this.productsRepository.findOnePopulate({ prod_id: item.prod_id },
        [
          {
            model: "Merchant",
            path: 'merchant',
          }
        ]
      ) as IProduct
      const payload: PaidOrderingEvent = {
        payment_method: data.payment_method,
        user_id: data.user_id,
        chkt_id: data.chkt_id,
        amount_: data.total,
        token: data.token,
        orders: data.orders
      }
      const chktProduct = item.product
      if (
        currentProduct &&
        chktProduct &&
        this.productsUtilService.isValid(currentProduct) &&
        this.productsUtilService.isValid(chktProduct) &&
        this.productsUtilService.isEqual(currentProduct, chktProduct) &&
        this.productsUtilService.isIncludePayment(currentProduct, data.payment_method) &&
        this.productsUtilService.isIncludePayment(chktProduct, data.payment_method)
      ) {

        if (
          item.vrnt_id &&
          this.productsUtilService.isHasVariant(currentProduct) &&
          this.productsUtilService.isIncludeVariant(currentProduct, item.vrnt_id) &&
          this.productsUtilService.isEnoughVariant(currentProduct, item.vrnt_id, item.quantity)
        ) {
          const product = await this.productsRepository.findOneAndUpdate({ prod_id: item.product.prod_id, "variants.vrnt_id": item.vrnt_id }, { $inc: { "variants.$.stock": newStock } }) as IProduct
          if (product && this.productsUtilService.isEnoughVariant(product, item.vrnt_id, 0)) {
            if (data.payment_method === PaymentMethodFormat.CREDIT) {
              this.logger.warn("Emit to payment", data.payment_method)

              await lastValueFrom(this.paymentClient.emit(PAID_ORDERING_EVENT, payload))
              await lastValueFrom(
                this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
                  ...product
                })
              )
            } else if (data.payment_method === PaymentMethodFormat.WALLET) {
              const payload: IDeleteChktEventPayload = {
                user_id: data.user_id,
                chkt_id: data.chkt_id
              }
              await lastValueFrom(
                this.cartsClient.emit(CARTS_DELETE_ITEMS_EVENT, payload)
              )
            }
            return
          }
        } else if (
          !item.vrnt_id &&
          !this.productsUtilService.isHasVariant(currentProduct) &&
          this.productsUtilService.isEnoughStock(currentProduct, item.quantity)
        ) {
          const product = await this.productsRepository.findOneAndUpdate({ prod_id: item.product.prod_id }, { $inc: { stock: newStock } }) as IProduct
          if (product && this.productsUtilService.isEnoughStock(product, 0)) {
            if (data.payment_method === PaymentMethodFormat.CREDIT) {
              this.logger.warn("Emit to payment no options", data.payment_method)
              await lastValueFrom(this.paymentClient.emit(PAID_ORDERING_EVENT, payload))
              await lastValueFrom(
                this.cartsClient.emit(CARTS_UPDATE_PRODUCT_EVENT, {
                  ...product
                })
              )
            } else if (data.payment_method === PaymentMethodFormat.WALLET) {
              const payload: IDeleteChktEventPayload = {
                user_id: data.user_id,
                chkt_id: data.chkt_id
              }
              await lastValueFrom(
                this.cartsClient.emit(CARTS_DELETE_ITEMS_EVENT, payload)
              )
            }
            return
          }

        }


        //throw error here


        // if (item.vrnt_id) {
        //   const product = await this.productsRepository.findOneAndUpdate({ prod_id: item.product.prod_id, "variants.vrnt_id": item.vrnt_id }, { $inc: { "variants.$.stock": newStock } })
        //   if (!product) throw new BadRequestException("Product info has changed")
        //   const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
        //   if (!variant) throw new BadRequestException("Product info has changed")
        //   if (variant.stock < 0) throw new BadRequestException("Product info has chagned")
        //   return product
        // } else {

        //   const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: item.product.prod_id }, { $inc: { stock: newStock } })
        //   if (!newProduct) throw new BadRequestException("Product info has changed")
        //   if (newProduct.stock < 0) throw new BadRequestException("Out of stock")
        //   return newProduct
        // }
      }
    }))
  }

}
