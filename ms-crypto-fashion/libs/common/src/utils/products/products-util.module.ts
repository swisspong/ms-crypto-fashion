import { Module } from "@nestjs/common";
import { ProductsUtilService } from "./products-util.service";

@Module({
    providers: [ProductsUtilService],
    exports: [ProductsUtilService]
})
export class ProductsUtilModule {}