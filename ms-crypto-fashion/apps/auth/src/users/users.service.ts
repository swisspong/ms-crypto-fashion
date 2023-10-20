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
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { SendEmailResetDto } from './dto/send-email-reset-pass.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ACCOUNT_NOT_FOUND, EMAIL_IS_ALREADY_IN_USE, NOT_FIX_YOURSELF } from '@app/common/constants/error.constant';
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
    if (!user) throw new NotFoundException(ACCOUNT_NOT_FOUND)
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



  async updateAdvanced(user_current: string, id: string, updateUserDto: UpdateUserAdvancedDto) {
    try {
      const { permissions, email, google_id, password, username, role } = updateUserDto
      const admin = await this.userRepository.findOne({ user_id: id })

      if (user_current === admin.user_id) throw new HttpException(NOT_FIX_YOURSELF, HttpStatus.BAD_REQUEST);

      if (admin.email !== email) {
        const owner = await this.userRepository.findOne({ email })
        if (owner) throw new HttpException(EMAIL_IS_ALREADY_IN_USE, HttpStatus.BAD_REQUEST);
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
      if (user) throw new HttpException(EMAIL_IS_ALREADY_IN_USE, HttpStatus.BAD_REQUEST);

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
      const result = await this.userRepository.findAndUpdate({ mcht_id: data.mcht_id }, { 
        $set: {  role: RoleFormat.USER },
        $unset: {
          mcht_id: 1
        } 
      })
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
      const user = await this.userRepository.findOne({ email: data.email })

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

  async changePasswordUser(user_id: string, data: ChangePasswordUserDto) {
    try {
      const { new_password, old_password } = data


      const user = await this.userRepository.findOne({ user_id })

      if (!user) throw new NotFoundException(ACCOUNT_NOT_FOUND);

      if (!await this.hashService.comparePassword(old_password, user.password))
        return { status: "failure" }

      const hash = await this.hashService.hashPassword(new_password)
      const newPassword = await this.userRepository.findOneAndUpdate({
        user_id
      }, {
        $set: {
          password: hash
        }
      })


      return { status: newPassword ? "success" : "failure" }

    } catch (error) {
      console.log(error);

    }
  }

  // * Reset Password

  async sendEmailResetPass(data: SendEmailResetDto) {
    try {
      const { email } = data

      const user = await this.userRepository.findOne({ email })

      if (!(user && user.isVerified)) throw new NotFoundException(ACCOUNT_NOT_FOUND);

      const token = await this.uid.randomUUID(60)

      const updateUser = await this.userRepository.findOneAndUpdate({
        user_id: user.user_id
      }, {
        $set: {
          passToken: token
        }
      })

      const mailOptions = {
        from: this.configService.get('MAIL_USER', { infer: true }) as string,
        to: updateUser.email,
        subject: "Crypto Fashion Reset Password.",
        html: `
          <h2> ${updateUser.username} มีการรีเซ็ตรหัสผ่านของคุณบนเว็บไซต์ของเรา</h2>
          <h4>กรุณายืนยันการรีเซ็ตรหัสผ่านของคุณเพื่อดำเนินการรีเซ็ตรหัสผ่าน...</h4>
          <a href="${this.configService.get('HOST_MAIN', { infer: true })}/password_reset?token=${updateUser.passToken}">เปลี่ยนรหัสผ่าน</a>
        `
      }


      await this.mailerService.sendMail(mailOptions)

      return { status: "success" }
    } catch (error) {
      console.log(error);

    }
  }

  async checkTokenResetPassword(token: string) {
    try {
      const user = await this.userRepository.findOne({ passToken: token })
      if (!user) return { status: "failure" }

      return { status: "success" }
    } catch (error) {
      console.log(error);

    }
  }

  async resetPasswordByUser(token: string, data: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findOne({ passToken: token })
      if (!user) return { status: "failure" }

      const hash = await this.hashService.hashPassword(data.password)
      const newPass = await this.userRepository.findOneAndUpdate({
        user_id: user.user_id
      }, {
        $set: {
          password: hash
        }
      })

      return {status: "success"}
    } catch (error) {
      console.log(error);
      
    }
  }

}
