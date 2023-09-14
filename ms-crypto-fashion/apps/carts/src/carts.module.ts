import { Module, forwardRef } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { DatabaseModule, RmqModule, authProviders } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from '@app/common/strategy';
import { CartsRepository } from './carts.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { PRODUCTS_SERVICE, PRODUCTS_TCP } from '@app/common/constants/products.constant';
import { ProductsUtilModule } from '@app/common/utils/products/products-util.module';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required()
      })
    }),
    RmqModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'products-service',
          port: 4001
        },
      },
    ]),
    
    CheckoutsModule,
    ProductsUtilModule
  ],
  controllers: [CartsController],
  providers: [
    ...authProviders,
    CartsService,
    CartsRepository,
    JwtStrategy
  ],
  exports: [CartsRepository]
})
export class CartsModule { }
