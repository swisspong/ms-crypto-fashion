import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersRepository } from './users.repository';
import { HashModule, RmqModule } from '@app/common';
import { PRODUCTS_SERVICE } from '@app/common/constants/products.constant';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashModule,
    RmqModule,
    RmqModule.register({name: PRODUCTS_SERVICE})
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository]
})
export class UsersModule { }
