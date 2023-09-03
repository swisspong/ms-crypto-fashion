import { Injectable, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, CREATE_MERCHANT_EVENT } from '@app/common/constants';
import { MerchantStatus, RoleFormat } from '@app/common/enums';
import { JwtUtilsService } from '@app/common';
import { MerchantsRepository } from './merchants.repository';
import { lastValueFrom } from 'rxjs';
import { CreateMerchantData } from '@app/common/interfaces';
import { CredentialMerchantDto } from './dto/credential-merchant.dto';
// import { MerchantStatus } from './schemas/merchant.schema';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
interface StatusTotal {
    _id: MerchantStatus;
    count: number
}

@Injectable()
export class MerchantsService {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
        private readonly jwtUtilsService: JwtUtilsService,
        private readonly merchantsRepository: MerchantsRepository
    ) { }
    private readonly uid = new ShortUniqueId()
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
        if (merchant.status !== MerchantStatus.CLOSED && merchant.status !== MerchantStatus.DISAPPROVAL) throw new BadRequestException("Invalid credential.")
        await this.merchantsRepository.findOneAndUpdate({ mcht_id: merchantId }, { $set: { status: MerchantStatus.IN_PROGRESS, first_name: dto.first_name, last_name: dto.last_name, id_card_img: dto.image_url } })
        return { message: "success" }
    }
    async editMerchantProfile(mchtId: string, updateMerchantDto: UpdateMerchantDto) {
        const merchant = await this.merchantsRepository.findOne({ mcht_id: mchtId })
        if (!merchant) throw new BadRequestException("Invalid credential.");
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
        const result = await this.merchantsRepository.findOneAndDelete({ mcht_id })
        return result
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
            console.log(merchant)
            if (merchant.status !== MerchantStatus.IN_PROGRESS) throw new BadRequestException("Invalid credential.")
            return await this.merchantsRepository.findOneAndUpdate({ mcht_id: id }, { $set: { status: status } })
        } catch (error) {
            console.log(error)
        }
    }
}
