import { Module } from "@nestjs/common";
import { CartsUtilService } from "./carts-util.service";
import { ProductsUtilModule } from "../products/products-util.module";

@Module({
    imports:[ProductsUtilModule],
    providers: [CartsUtilService],
    exports: [CartsUtilService]
})
export class CartsUtilModule {}