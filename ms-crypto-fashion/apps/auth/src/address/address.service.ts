import { Injectable } from '@nestjs/common';
import { IAddressDto } from './dto/address.dto';
import { AddressRepository } from './address.repository';
import ShortUniqueId from 'short-unique-id';
import { Types } from 'mongoose';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UsersRepository } from '../users/users.repository';


@Injectable()
export class AddressService {
  private readonly uid = new ShortUniqueId()

  constructor(
    private readonly addressRepository: AddressRepository
  ) { }

  async createDeliveryAddress(user_id: string, createAddressDto: IAddressDto) {
    try {
      const { address, post_code, tel_number, recipient } = createAddressDto
      const addressUser = await this.addressRepository.create({ addr_id: `address_${this.uid.stamp(15)}`, address, post_code, tel_number, user_id: user_id, recipient })

      return addressUser;
    } catch (error) {
      console.log(error)
    }
  }

  async findByUser(user_id: string) {
    try {

      const address = await this.addressRepository.find({ user_id })

      return address
    } catch (error) {
      console.log(error)
    }
  }

  async updateAddress(addr_id: string, updateAddress: UpdateAddressDto) {
    try {

      const result = await this.addressRepository.findOneAndUpdate({ addr_id }, { $set: { ...updateAddress } })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async deleteAddress(addr_id: string) {
    try {
      const result = await this.addressRepository.findOneAndDelete({ addr_id })

      return result
    } catch (error) {
      throw error
      console.log(error)
    }
  }
}
