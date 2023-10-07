import { Injectable, NotFoundException, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { PermissionDto, UpdateUserAdvancedDto } from './dto/update-user-advanced.dto';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { UsersRepository } from './users.repository';
import ShortUniqueId from 'short-unique-id';
// import { RoleFormat } from './schema/user.schema';
import { HashService } from '@app/common';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantData, DeleteMerchantData } from '@app/common/interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { MERCHANT_DELETE_P, PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { lastValueFrom } from 'rxjs';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailDto } from './dto/update-email.dtp';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);
  private readonly uid = new ShortUniqueId();
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy,
    private readonly userRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }

  // Admin
  async findAllAdmin(per_page: number, page: number) {
    try {
      const skip = (Number(page) - 1) * Number(per_page)
      const limit = per_page
      const users = await this.userRepository.findSelect({ role: "admin" }, [], skip, limit, '_id user_id username email role permission')
      const total = await this.userRepository.findCount({ role: "admin" })
      return {
        page: Number(page),
        per_page: Number(per_page),
        total,
        total_page: Math.ceil(total / Number(per_page)),
        data: users,
      };
    } catch (error) {
      console.log(error)
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findOne({ user_id: userId })
    if (!user) throw new NotFoundException("User not found.")
    return user
  }

  async removeAdvanced(id: string) {
    try {
      const result = await this.userRepository.findOneAndDelete({ user_id: id })
      return result
    } catch (error) {
      throw error
    }
  }



  async updateAdvanced(id: string, updateUserDto: UpdateUserAdvancedDto) {
    try {
      const { permissions, email, google_id, password, username, role } = updateUserDto
      const admin = await this.userRepository.findOne({ user_id: id })
      if (admin.email !== email) {
        const owner = await this.userRepository.findOne({ email })
        if (owner) throw new HttpException('Email is already exise.', HttpStatus.BAD_REQUEST);
      }


      const permission = await this.formatPermission(permissions);
      let hash: string = undefined;

      if (password !== undefined) {
        hash = await this.hashService.hashPassword(password)
      }

      const user = await this.userRepository.findOneAndUpdate({ user_id: id }, { username, email, permission: permission, password: hash, role, google_id })
      return user

    } catch (error) {
      throw error
    }
  }

  async createAdmin(createAdmin: CreateAdminDto) {
    try {
      const { email, password, permissions } = createAdmin
      const user = await this.userRepository.findOne({ email })
      console.log(user)
      if (user) throw new HttpException('Email is already exise.', HttpStatus.BAD_REQUEST);

      const permission = await this.formatPermission(permissions)
      const hash = await this.hashService.hashPassword(password)
      console.log("create admin")
      const newAdmin = await this.userRepository.create({ ...createAdmin, user_id: `user_${this.uid.stamp(15)}`, password: hash, role: RoleFormat.ADMIN, permission })
      console.log(newAdmin);

      return newAdmin
    } catch (error) {
      console.log(error)
    }
  }

  async findAdminById(id: string) {
    try {
      const user = await this.userRepository.findOne({ user_id: id, role: "admin" })
      return user
    } catch (error) {
      console.log(error)
    }
  }

  // * function format data payload request
  async formatPermission(permissions: PermissionDto[]): Promise<string[] | undefined> {
    if (permissions !== undefined) {
      return await permissions.map(obj => obj.permission);
    } else {
      return undefined
    }
  }

  async putMerchantIdToUser(data: CreateMerchantData) {
    try {

      this.logger.warn("create_merchant =>", data)
      const updated = await this.userRepository.findOneAndUpdate({ user_id: data.user_id }, { $set: { mcht_id: data.mcht_id, role: RoleFormat.MERCHANT } })
      this.logger.warn("updated to merchant =>", updated)
    } catch (error) {
      this.logger.error(error)
    }

  }

  async deleteMerchantIdInUser(data: DeleteMerchantData) {
    try {
      this.logger.warn("update_merchant", data)
      const result = await this.userRepository.findAndUpdate({ mcht_id: data.mcht_id }, { $set: { mcht_id: "", role: RoleFormat.USER } })
      this.logger.warn("update to merchant =>", result)
      await lastValueFrom(
        this.productClient.emit(MERCHANT_DELETE_P, data)
      )
    } catch (error) {
      this.logger.error(error)
    }
  }

  // ! user
  async updateProfileByUser(user_id: string, data: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findAndUpdate({ user_id }, {
        $set: {
          ...data
        }
      })
      return { status: "success" }
    } catch (error) {
      console.log(error);
    }
  }

  async sendChangeEmail(user_id: string, data: UpdateEmailDto) {
    try {
      const user = await this.userRepository.findOne({email: data.email}) 

      if (user) return { status: "failure" }

      const token = await this.uid.randomUUID(50)
      const updateUser = await this.userRepository.findOneAndUpdate({ user_id }, {
        $set: {
          changeToken: token,
          changeEmail: data.email
        }
      })
      const mailOptions = {
        from: this.configService.get('MAIL_USER', { infer: true }) as string,
        to: updateUser.changeEmail,
        subject: "Crypto Fashion Change you email.",
        html: `
          <h2> ${updateUser.username} มีการอัปเดตข้อมูลที่อยู่อีเมลของคุณบนเว็บไซต์ของเรา</h2>
          <h4>กรุณายืนยันอีเมลของคุณเพื่อดำเนินการเปลี่ยนอีเมลต่อ...</h4>
          <a href="${this.configService.get('HOST_MAIN', { infer: true })}/change-email?token=${updateUser.changeToken}">ยืนยันการเปลี่ยนอีเมลของคุณ</a>
        `
      }


      await this.mailerService.sendMail(mailOptions)

      return { status: "success" }
    } catch (error) {
      console.log(error);
    }
  }
  async changeEmailByUser(token: string) {
    try {
      
      const user = await this.userRepository.findOne({ changeToken: token })
      if (!user) return { status: "failure" }

      const changeEmail = await this.userRepository.findOneAndUpdate({ user_id: user.user_id }, {
        $set: {
          email: user.changeEmail
        },
        $unset: {
          changeToken: 1,
          changeEmail: 1
        }
      })
      
      return { status: changeEmail ? "success" : "failure" }
    } catch (error) {
      console.log(error);

    }
  }
 
}
