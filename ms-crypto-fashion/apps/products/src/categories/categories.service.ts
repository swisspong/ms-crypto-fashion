import { Injectable, Inject, ForbiddenException, BadRequestException, Post, Body, Logger, NotFoundException } from '@nestjs/common';

import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, CREATE_MERCHANT_EVENT } from '@app/common/constants';
import { RoleFormat } from '@app/common/enums';
import { JwtUtilsService } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { CreateMerchantData } from '@app/common/interfaces';
import { CategoriesRepository } from './categories.repository';
import { GetUserId, Roles } from '@app/common/decorators';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryByOwnerDto } from './dto/get-category-by-owner.dto';
import { Types } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryWebRepository } from './category-web.repository';


@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name)
    constructor(
        private readonly categoriesRepository: CategoriesRepository,
        private readonly categoryWebRepository: CategoryWebRepository
    ) { }
    private readonly uid = new ShortUniqueId()
    async create(mcht_id: string, createCategoryDto: CreateCategoryDto) {
        const existCategory = await this.categoriesRepository.findOne({ mcht_id, name: createCategoryDto.name })
        if (existCategory) throw new BadRequestException("Category is exist.")
        const newCategory = await this.categoriesRepository.create({ cat_id: `cat_${this.uid.stamp(15)}`, ...createCategoryDto, mcht_id })
        return {
            message: "success"
        }
    }

    async findAllOnlyOwner(merchantId: string, categoriesFilter: GetCategoryByOwnerDto) {
        let sort = {}
        if (categoriesFilter.sort) {
            const sortArr = categoriesFilter.sort.split(",")
            if (sortArr.length > 1) {

                sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

            }
        }

        const total = await this.categoriesRepository.aggregate([
            {
                $lookup: {
                    from: "merchants",
                    localField: "mcht_id",
                    foreignField: "mcht_id",
                    as: "merchant"
                },
            },
            {
                $match: {
                    "merchant.mcht_id": merchantId,
                    name: { $regex: categoriesFilter.search, $options: 'i' },
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


        const categories = await this.categoriesRepository.aggregate([
            {
                $lookup: {
                    from: "merchants",
                    localField: "mcht_id",
                    foreignField: "mcht_id",
                    as: "merchant"
                },
            },
            {
                $match: {
                    "merchant.mcht_id": merchantId,
                    name: { $regex: categoriesFilter.search, $options: "i" },
                },
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    "merchant": 0,
                }
            },
            {
                ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
            },
            {
                $skip: (categoriesFilter.page - 1) * categoriesFilter.per_page,
            },
            {
                $limit: categoriesFilter.per_page
            },
        ])

        return {
            data: categories,
            page: categoriesFilter.page,
            per_page: categoriesFilter.per_page,
            total: total[0]?.count || 0,
            total_page: Math.ceil((total[0]?.count || 0) / categoriesFilter.per_page)
        }
    }
    async findAllByMerchantId(mchtId: string, categoriesFilter: GetCategoryByOwnerDto) {
        let sort = {}
        if (categoriesFilter.sort) {
            const sortArr = categoriesFilter.sort.split(",")
            if (sortArr.length > 1) {

                sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1

            }
        }

        const total = await this.categoriesRepository.aggregate([
            {
                $lookup: {
                    from: "merchants",
                    localField: "mcht_id",
                    foreignField: "mcht_id",
                    as: "merchant"
                },
            },

            {
                $match: {

                    "merchant.mcht_id": mchtId,
                    name: { $regex: categoriesFilter.search, $options: 'i' },
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


        const categories = await this.categoriesRepository.aggregate([
            {
                $lookup: {
                    from: "merchants",
                    localField: "mcht_id",
                    foreignField: "mcht_id",
                    as: "merchant"
                },
            },

            {
                $match: {
                    "merchant.mcht_id": mchtId,
                    name: { $regex: categoriesFilter.search, $options: "i" },
                    "merchant.status": "opened"
                },
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    "merchant": 0,
                }
            },
            {
                ...(Object.keys(sort).length > 0 ? { $sort: sort } : { $sort: { "createdAt": 1 } }),
            },
            {
                $skip: (categoriesFilter.page - 1) * categoriesFilter.per_page,
            },
            {
                $limit: categoriesFilter.per_page
            },
        ])

        return {
            data: categories,
            page: categoriesFilter.page,
            per_page: categoriesFilter.per_page,
            total: total[0]?.count || 0,
            total_page: Math.ceil((total[0]?.count || 0) / categoriesFilter.per_page)
        }
    }



    async findOneByOwner(id: string, merchantId: string) {
        const category = await this.categoriesRepository.findOne({ cat_id: id, merchant: new Types.ObjectId(merchantId) })
        return category
    }

    async update(catId: string, merchantId: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoriesRepository.findOne({ cat_id: catId, mcht_id: merchantId })
        if (!category) throw new NotFoundException("Category not found.")
        const existCategory = await this.categoriesRepository.findOne({ cat_id: { $not: { $eq: catId } }, mcht_id: merchantId, name: updateCategoryDto.name })
        if (existCategory) throw new BadRequestException("Category name is existing.")
        const newCategory = await this.categoriesRepository.findOneAndUpdate({ cat_id: category.cat_id, mcht_id: category.mcht_id }, updateCategoryDto)
        return newCategory
    }
    async remove(catId: string, merchantId: string) {
        const category = await this.categoriesRepository.findOne({ cat_id: catId, mcht_id: merchantId })
        if (!category) throw new NotFoundException("Category not found.")
        return await this.categoriesRepository.findOneAndDelete({ cat_id: catId, mcht_id: merchantId })
    }

    // ! Service category for admin

    async createByAdmin(user_id: string, createCategory: CreateCategoryDto) {
        try {
            const { name, image_url } = createCategory
            const existCategory = await this.categoryWebRepository.findOne({ user_id, name })
            if (existCategory) throw new BadRequestException("Category is exist.")
            const newCategory = await this.categoryWebRepository.create({ catweb_id: `catweb_${this.uid.stamp(15)}`, ...createCategory, user_id })
            return newCategory;
        } catch (error) {
            console.log(error)
        }
    }

    async findAllCategories(per_page: number, page: number) {
        try {
            const skip = (Number(page) - 1) * Number(per_page)
            const limit = per_page
            // TODO find filter data

            const categories = await this.categoryWebRepository.find({}, [], skip, limit)
            const total = await this.categoryWebRepository.findCount({})

            return {
                page: Number(page),
                per_page: Number(per_page),
                total,
                total_page: Math.ceil(total / Number(per_page)),
                data: categories,
            };
        } catch (error) {
            console.log(error)
        }
    }

    async updateCategoryWeb(catweb_id: string, user_id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            const existCategory = await this.categoryWebRepository.findOne({ catweb_id: { $not: { $eq: catweb_id } }, name: updateCategoryDto.name })
            if (existCategory) throw new BadRequestException("Category name is existing.")
            const newCategory = await this.categoryWebRepository.findOneAndUpdate({ catweb_id }, { $set: { ...updateCategoryDto, user_id } })
            return {
                message: "success"
            }

        } catch (error) {
            console.log(error)
        }
    }

    async findOneById(id: string) {
        const category = await this.categoryWebRepository.findOne({ catweb_id: id })
        return category
    }
    async removeCategoryWeb(catweb_id: string) {
        const category = await this.categoryWebRepository.findOneAndDelete({ catweb_id })
        return category
    }

}
