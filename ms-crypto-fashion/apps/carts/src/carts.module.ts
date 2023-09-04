import { Module } from '@nestjs/common';
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
        name: 'PRODUCTS',
        transport: Transport.TCP,
        options: {
          host:'products-service',
          port: 4001
        },

      },

    ]),
    CheckoutsModule,
  ],
  controllers: [CartsController],
  providers: [
    ...authProviders,
    CartsService,
    CartsRepository,
    JwtStrategy
  ],
  exports:[CartsService]
})
export class CartsModule { }
