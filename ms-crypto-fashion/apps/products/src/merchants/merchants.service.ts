import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import ShortUniqueId from 'short-unique-id';
@Injectable()
export class MerchantsService {
    private readonly uid = new ShortUniqueId()
    async createStarterMerchant(userId: string, createMerchantDto: CreateMerchantDto, res: any) {
        // const user = await this.userRepository.findOne({ user_id: userId })


        // if (user.role === RoleFormat.MERCHANT) {
        //     throw new ForbiddenException()
        // } else {
        //     const merchant = await this.merchantsRepository.create({ mcht_id: `mcht_${this.uid.stamp(15)}`, name: createMerchantDto.name, banner_title: createMerchantDto.banner_title, amount: 0 })
        //     // const newUser = await this.userRepository.findOneAndUpdate({ user_id: userId }, {
        //     //     role: RoleFormat.MERCHANT,
        //     //     merchant: new Types.ObjectId((merchant as any)._id.toString()),
        //     //     //merchant: merchant.mcht_id,
        //     // })
        //     console.log(newUser.role)
        //     const accessToken = await this.signToken({ email: newUser.email, sub: newUser.user_id, role: newUser.role, merchant: (merchant as any)._id.toString(), permission: newUser.permission })
        //     res.cookie("token", accessToken)

        //     return merchant
        // }

    }
}
