import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { IAddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';


@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }


  @Post()
  createDeliveryAddress(@GetUserId() userId: string, @Body() createAddressDto: IAddressDto) {
    return this.addressService.createDeliveryAddress(userId, createAddressDto);
  }


  @Get()
  findByUserId(@GetUserId() userId: string) {
    return this.addressService.findByUser(userId)
  }
  @Roles(RoleFormat.USER)
  @Get(':user_id')
  findByUser(@Param('user_id') user_id: string) {
    return this.addressService.findByUser(user_id)
  }

  @Patch(':id')
  updateAddress(@Param('id') address_id: string, @Body() updateAddress: UpdateAddressDto) {
    return this.addressService.updateAddress(address_id, updateAddress)
  }

  @Delete(':id')
  deleteAddress(@Param('id') address_id: string) {
    return this.addressService.deleteAddress(address_id)
  }
}
