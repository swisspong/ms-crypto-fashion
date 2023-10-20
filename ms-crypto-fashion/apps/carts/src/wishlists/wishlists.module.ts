import { DatabaseModule, RmqModule } from "@app/common";
import { Module, forwardRef } from "@nestjs/common";
import { WishListRepository } from "./wishlists.repository";
import { WishList, WishListSchema } from "./schemas/wishlists.schema";
import { WishListService } from "./wishlists.service";
import { WishListController } from "./wishlists.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PRODUCTS_SERVICE } from "@app/common/constants/products.constant";
import { CartsModule } from "../carts.module";

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: WishList.name, schema: WishListSchema }]),
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
        RmqModule,
        forwardRef(() => CartsModule)
    ],
    controllers: [WishListController],
    providers: [
        WishListService,
        WishListRepository
    ],
    exports: [
        WishListRepository
    ]
})
export class WishListsModule { }