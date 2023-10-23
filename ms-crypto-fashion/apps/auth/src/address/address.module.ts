import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schema/address.schema';
import { AddressRepository } from './address.repository';
import { UsersModule } from '../users/users.module';
import { authProviders } from '@app/common';

@Module({
  imports:[MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]), UsersModule],
  controllers: [AddressController],
  providers: [
    ...authProviders,
    AddressService,
    AddressRepository],
  exports: [AddressRepository]
})
export class AddressModule {}
