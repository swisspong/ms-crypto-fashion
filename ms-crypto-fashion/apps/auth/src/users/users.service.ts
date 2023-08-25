import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PermissionDto, UpdateUserAdvancedDto } from './dto/update-user-advanced.dto';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { UsersRepository } from './users.repository';
import ShortUniqueId from 'short-unique-id';
// import { RoleFormat } from './schema/user.schema';
import { HashService } from '@app/common';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantData } from '@app/common/interfaces';
@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);
  private readonly uid = new ShortUniqueId();
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashService: HashService
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

      if (user) throw new HttpException('Email is already exise.', HttpStatus.BAD_REQUEST);

      const permission = await this.formatPermission(permissions)
      const hash = await this.hashService.hashPassword(password)

      const newAdmin = await this.userRepository.create({ ...createAdmin, user_id: `user_${this.uid.stamp(15)}`, password: hash, role: RoleFormat.ADMIN, permission })

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
}
