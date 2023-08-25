import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from './categories/categories.repository';
import { CategoryWebRepository } from './categories/category-web.repository';
import { MerchantsRepository } from './merchants/merchants.repository';
import { GetProductDto } from './dto/get-product.dto';
import { SearchType } from './dto/get-product-base.dto';

@Injectable()
export class ProductsService {
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoriesWebRepository: CategoryWebRepository,
    private readonly merchantsRepository: MerchantsRepository
  ) { }
  async create(userId: string, createProductDto: CreateProductDto) {
    const merchant = await this.merchantsRepository.findOne({ user_id: userId })
    if (!merchant) throw new ForbiddenException()
    const existProduct = await this.productsRepository.findOne({ merchant: merchant._id, name: createProductDto.name })
    if (existProduct) throw new BadRequestException("Product is exist.")
    const categories = await this.categoriesRepository.find({
      merchant: merchant._id,
      cat_id: {
        $in: createProductDto.categories.map(item => item.cat_id)
      }
    })
    const categoriesWeb = await this.categoriesWebRepository.find({

      catweb_id: {
        $in: createProductDto.categories_web.map(item => item.cat_id)
      }
    })
    console.log(categories, createProductDto.categories, createProductDto.categories.map(item => item.cat_id))
    if (categories.length !== createProductDto.categories.length) throw new BadRequestException("Invalid Category")
    if (categoriesWeb.length !== createProductDto.categories_web.length) throw new BadRequestException("Invalid Category")
    const newProduct = await this.productsRepository.create({
      prod_id: `prod_${this.uid.stamp(15)}`, ...createProductDto, merchant: merchant, image_urls: createProductDto.image_urls.map(image => image.url),
      categories: categories.map(cat => cat._id),
      categories_web: categoriesWeb.map(cat => cat._id),
      // groups: [],
      // variants: [],
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
}
