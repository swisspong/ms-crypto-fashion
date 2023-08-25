import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, CREATE_MERCHANT_EVENT } from '@app/common/constants';
import { RoleFormat } from '@app/common/enums';
import { JwtUtilsService } from '@app/common';
import { MerchantsRepository } from './merchants.repository';
import { lastValueFrom } from 'rxjs';
import { CreateMerchantData } from '@app/common/interfaces';
@Injectable()
export class MerchantsService {
    constructor(
        // @Inject(AUTH_SERVICE) private authClient: ClientProxy,
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
                // await lastValueFrom(
                //     this.authClient.emit(CREATE_MERCHANT_EVENT, {
                //         data
                //     })
                // )
                const accessToken = await this.jwtUtilsService.signToken({ sub: data.user_id, role: data.role, merchant: data.mcht_id, permission: permission })
                res.cookie("token", accessToken)

                await session.commitTransaction();
                return { message: 'success' }
            }

        } catch (error) {
            await session.abortTransaction();
            throw error
        }

    }
}
