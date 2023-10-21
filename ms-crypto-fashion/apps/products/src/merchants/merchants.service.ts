import { Injectable, Inject, ForbiddenException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, CREATE_MERCHANT_EVENT, DELETE_MERCHANT_EVENT } from '@app/common/constants';
import { MerchantStatus, RoleFormat } from '@app/common/enums';
import { JwtUtilsService } from '@app/common';
import { MerchantsRepository } from './merchants.repository';
import { lastValueFrom } from 'rxjs';
import { CreateMerchantData, DeleteMerchantData } from '@app/common/interfaces';
import { CredentialMerchantDto } from './dto/credential-merchant.dto';
// import { MerchantStatus } from './schemas/merchant.schema';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateChargeMerchant } from '@app/common/interfaces/payment.event.interface';
import { StatusFormat } from 'apps/orders/src/schemas/order.schema';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { OmiseService } from './omise.service';
import { GetProductNoTypeSerchatDto } from '../dto/get-product-no-type-search.dto';
import { ProductsRepository } from '../products.repository';
import { GetProductStoreDto } from '../dto/get-product-store.dto';
import { Product } from '../schemas/product.schema';
import { StoreQueryDto } from '../dto/store-query.dto';
import { ObjectId } from "mongodb"
import { PRODUCTS_DELETE_EVENT, PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { IMerchantId } from '@app/common/interfaces/products-event.interface';
import { ComplaintsRepository } from '../complaints/complaints.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { CARTS_SERVICE, WISHLIST_DELETE_ITEMS_BY_MERCHANT_ID_EVENT } from '@app/common/constants/carts.constant';
import { IDeleteMerchantId } from '@app/common/interfaces/carts.interface';
import { CategoriesRepository } from '../categories/categories.repository';
import { APPROVES_ERROR, INVALID_CREDENTIAL, MERCHANT_NOT_FOUND } from '@app/common/constants/error.constant';
interface StatusTotal {
    _id: MerchantStatus;
    count: number
}

@Injectable()
export class MerchantsService {
    private readonly logger = new Logger(MerchantsService.name)
    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
        @Inject(CARTS_SERVICE) private readonly cartClient: ClientProxy,
        private readonly jwtUtilsService: JwtUtilsService,
        private readonly complaintsRepository: ComplaintsRepository,
        private readonly commentsRepository: CommentsRepository,
        private readonly merchantsRepository: MerchantsRepository,
        private readonly categoryRepository: CategoriesRepository,
        private readonly omiseService: OmiseService,
        private readonly productsRepository: ProductsRepository
    ) { }
    private readonly uid = new ShortUniqueId()
    async findAllProductsForUser(mchtId: string, productFilter: GetProductNoTypeSerchatDto) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: mchtId, status: MerchantStatus.OPENED })
        if (!merchant) throw new NotFoundException(MERCHANT_NOT_FOUND)
        let sort = {}
        if (productFilter.sort) {
            const sortArr = productFilter.sort.split(",")
            if (sortArr.length > 1) {
                sort[sortArr[0]] = sortArr[1] === "desc" ? -1 : 1
            }
        }
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
                $match: {
                    $or: [
                        {
                            $and: [
                                {
                                    groups: {
                                        $exists: true,
                                        $ne: [],
                                    },
                                },
                                {
                                    variants: {
                                        $exists: true,
                                        $ne: [],
                                    },
                                },
                            ],
                        },
                        {
                            $and: [
                                {
                                    groups: {
                                        $size: 0,
                                    },
                                },
                                {
                                    variants: {
                                        $size: 0,
                                    },
                                },
                            ],
                        },
                    ],
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
                $match: {
                    $or: [
                        {
                            $and: [
                                {
                                    groups: {
                                        $exists: true,
                                        $ne: [],
                                    },
                                },
                                {
                                    variants: {
                                        $exists: true,
                                        $ne: [],
                                    },
                                },
                            ],
                        },
                        {
                            $and: [
                                {
                                    groups: {
                                        $size: 0,
                                    },
                                },
                                {
                                    variants: {
                                        $size: 0,
                                    },
                                },
                            ],
                        },
                    ],
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
        this.logger.log("mcht_id", merchantId)
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
    async merchantStorefrontOneProduct(id: string, merchantId: string, productFilter: StoreQueryDto) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
        if (!merchant) throw new ForbiddenException()
        // const product = await this.productsRepository.findOne({ prod_id: id, merchant: new Types.ObjectId(merchantId), ...(productFilter.store_front ? { available: true } : undefined) }, ["categories", "merchants"])
        // return product
        let product = await this.productsRepository.findOnePopulate({ prod_id: id, merchant: merchant._id, available: true },
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
    async merchantStorefront(userId: string, merchantId: string, productFilter: GetProductStoreDto) {
        // const user = await this.usersRepository.findOne({ user_id: userId, merchant: new Types.ObjectId(merchantId) })
        console.log(merchantId, "--------------------------------------------------------------------------")
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
                    available: true,
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
                    available: true,
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
    async createStarterMerchant(userId: string, role: string, merchant: string | undefined, permission: string[], createMerchantDto: CreateMerchantDto, res: any) {
        const session = await this.merchantsRepository.startTransaction()
        try {
            if (merchant) throw new ForbiddenException()
            if (role === RoleFormat.MERCHANT) {
                throw new ForbiddenException()
            } else {
                if (await this.merchantsRepository.findOne({ user_id: userId })) throw new ForbiddenException()
                const merchant = await this.merchantsRepository.create({ user_id: userId, mcht_id: `mcht_${this.uid.stamp(15)}`, name: createMerchantDto.name, banner_title: createMerchantDto.banner_title, amount: 0 }, { session })
                const data: CreateMerchantData = {
                    mcht_id: merchant.mcht_id,
                    user_id: userId,
                    role: RoleFormat.MERCHANT
                }
                await lastValueFrom(
                    this.authClient.emit(CREATE_MERCHANT_EVENT, {
                        ...data
                    })
                )
                const accessToken = await this.jwtUtilsService.signToken({ sub: data.user_id, role: data.role, merchant: data.mcht_id, permission: permission })
                res.cookie("token", accessToken, {
                    // secure: true, 
                    httpOnly: false,
                    // sameSite: 'none',
                    domain: 'example.com'
                })

                await session.commitTransaction();
                return { message: 'success' }
            }

        } catch (error) {
            await session.abortTransaction();
            throw error
        }

    }
    async getMerchantCredential(mchtId: string) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: mchtId })
        return merchant

    }

    async createCredential(merchantId: string, dto: CredentialMerchantDto) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: merchantId })
        if (merchant.status !== MerchantStatus.CLOSED && merchant.status !== MerchantStatus.DISAPPROVAL) throw new BadRequestException(INVALID_CREDENTIAL)
        await this.merchantsRepository.findOneAndUpdate({ mcht_id: merchantId }, { $set: { status: MerchantStatus.IN_PROGRESS, first_name: dto.first_name, last_name: dto.last_name, id_card_img: dto.image_url } })
        return { message: "success" }
    }
    async editMerchantProfile(mchtId: string, updateMerchantDto: UpdateMerchantDto) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: mchtId })
        if (!merchant) throw new BadRequestException(INVALID_CREDENTIAL);
        const { name, banner_title, banner_url, first_name, last_name } = updateMerchantDto
        await this.merchantsRepository.findOneAndUpdate({ mcht_id: merchant.mcht_id }, {
            $set: {
                name,
                banner_title,
                banner_url,
                first_name,
                last_name,
            }
        })
        return {
            message: "success"
        }
    }
    async findAll(per_page: number, page: number) {
        try {
            const skip = (Number(page) - 1) * Number(per_page)
            const limit = per_page

            const merchants = await this.merchantsRepository.aggregate([
                {
                    $skip: skip,
                },
                {
                    $limit: limit
                },
            ])

            const total: { totalCount: number }[] = await this.merchantsRepository.aggregate([
                {
                    $count: 'totalCount'
                }
            ])

            return {
                page: Number(page),
                per_page: Number(per_page),
                total: total[0]?.totalCount ?? 0,
                total_page: Math.ceil((total[0]?.totalCount ?? 0) / Number(per_page)),
                data: merchants,
            };
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getDashboard() {
        try {
            // TODO: จำนวนผู้ขายที่เปิดร้าน และ ส่งคำร้อง
            const statusCount: StatusTotal[] = await await this.merchantsRepository.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // TODO: แสดงยอดที่ผู้ขายสมัครเข้ามา
            const amountSub: { _id: null, amount: number }[] = await this.merchantsRepository.aggregate([
                {
                    $group: {
                        _id: null,
                        amount: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        amount: 1
                    }
                }
            ])

            let totalSub = 0, totalIn = 0

            await statusCount.forEach((status) => {
                const { _id, count } = status
                if (_id === MerchantStatus.IN_PROGRESS) totalIn = count
                if (_id === MerchantStatus.OPENED) totalSub = count
            })

            return {
                totalSub,
                totalIn,
                amountSub: amountSub[0].amount,
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findMerchantById(mcht_id: string) {
        try {
            const merchant = await this.merchantsRepository.findOne({ mcht_id })

            return merchant
        } catch (error) {
            console.log(error)
        }
    }

    async updateMerchantById(mcht_id: string, updateMerchant: UpdateMerchantDto) {
        try {

            const upMerchant = await this.merchantsRepository.findOneAndUpdate({ mcht_id }, { ...updateMerchant })
            return upMerchant
        } catch (error) {
            console.log(error)
        }
    }
    async deleteMerchantById(mcht_id: string) {
        try {
            const merchant = await this.merchantsRepository.findOne({ mcht_id })
            const data: DeleteMerchantData = {
                mcht_id
            }
            const id: IDeleteMerchantId = {
                _id: merchant._id
            }

            const deleteProducts = await this.productsRepository.findAndDelete({ merchant: new ObjectId(merchant._id) })

            const deleteComplaints = await this.complaintsRepository.findAndDelete({ mcht_id: merchant.mcht_id })

            const deleteComments = await this.commentsRepository.findAndDelete({ mcht_id: merchant.mcht_id })

            const deleteCategory = await this.categoryRepository.findAndDelete({ mcht_id: merchant.mcht_id })



            await lastValueFrom(
                this.cartClient.emit(WISHLIST_DELETE_ITEMS_BY_MERCHANT_ID_EVENT, {
                    ...id
                })
            )


            await lastValueFrom(
                this.authClient.emit(DELETE_MERCHANT_EVENT, {
                    ...data
                })
            )

            return { message: "success" }
            // const result = await this.merchantsRepository.findOneAndDelete({ mcht_id })
            // return result
        } catch (error) {
            console.log(error);
        }
    }
    async findAllApproves(per_page: number, page: number) {
        try {
            const skip = (Number(page) - 1) * Number(per_page)
            const limit = per_page

            const merchants = await this.merchantsRepository.aggregate([

                {
                    $match: {
                        status: MerchantStatus.IN_PROGRESS
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit
                },
            ])

            const total: { totalCount: number }[] = await this.merchantsRepository.aggregate([
                {
                    $match: {
                        status: MerchantStatus.IN_PROGRESS
                    },
                },
                {
                    $count: 'totalCount'
                }

            ])

            return {
                page: Number(page),
                per_page: Number(per_page),
                total: (total[0]?.totalCount ?? 0),
                total_page: Math.ceil((total[0]?.totalCount ?? 0) / Number(per_page)),
                data: merchants,
            };
        } catch (error) {
            console.log(error)
        }
    }
    async findOne(id: string) {
        return await this.merchantsRepository.findOne({ mcht_id: id })
    }

    async updateApproves(id: string, updateMerchantDto: UpdateStatusDto) {
        try {
            const { status } = updateMerchantDto
            const merchant = await this.merchantsRepository.findOne({ mcht_id: id })
            if (merchant.status !== MerchantStatus.IN_PROGRESS) throw new BadRequestException(APPROVES_ERROR)
            return await this.merchantsRepository.findOneAndUpdate({ mcht_id: id }, { $set: { status: status } })
        } catch (error) {
            console.log(error)
        }
    }

    async updateChargeMerchantEvent(data: UpdateChargeMerchant) {
        try {

            const { amount, end_date, mcht_id } = data
            await this.merchantsRepository.findAndUpdate({ mcht_id }, { $set: { amount, end_date, status: MerchantStatus.OPENED } })
            this.logger.warn("update charge month merchant")
        } catch (error) {
            throw error
        }
    }

    async deleteMerchantEvent(data: DeleteMerchantData) {
        try {
            const { mcht_id } = data
            await this.merchantsRepository.findOneAndDelete({ mcht_id })
            this.logger.warn("delete merchant")
        } catch (error) {
            throw error
        }
    }
    async createRecipient(mchtId: string, data: CreateRecipientDto) {
        const recp = await this.omiseService.createRecipient(data)
        await this.merchantsRepository.findAndUpdate({ mcht_id: mchtId }, { $set: { recp_id: recp.id } })
        return { message: "success" }
    }
}
