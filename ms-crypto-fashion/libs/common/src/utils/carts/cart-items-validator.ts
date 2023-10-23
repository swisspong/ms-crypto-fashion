import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CartItem } from "apps/carts/src/schemas/cart.schema";
import { Product } from "apps/products/src/schemas/product.schema";
import { ProductsValidator } from "../products/products-validator";
import { OUT_OF_STOCK, PRODUCT_HAS_NO_OPTIONS, PRODUCT_HAS_OPTIONS, PRODUCT_INFORMATION_HAS_CHANGED } from "@app/common/constants/error.constant";

@Injectable()
export class CartItemsValidator {
    private readonly logger = new Logger(CartItemsValidator.name)
    constructor(private readonly productsValidator: ProductsValidator) { }
    validate(cartItem: CartItem) {
        this.productsValidator.validate(cartItem.product)
        this.logger.error("out casessssssssss")

        if (
            cartItem.vrnt_id && !(
                (this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
                    this.productsValidator.validateIsHasOptions(cartItem.product.variants)))
        ) {
            throw new BadRequestException(PRODUCT_HAS_OPTIONS)
        }
        if (!cartItem.vrnt_id && !(
            !this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
            !this.productsValidator.validateIsHasOptions(cartItem.product.variants))) {
            throw new BadRequestException(PRODUCT_HAS_NO_OPTIONS)
        }
        if (
            this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
            this.productsValidator.validateIsHasOptions(cartItem.product.variants)
        ) {
            // 
            this.logger.error("in casessssssssss 111")
            if (!cartItem.vrnt_id) throw new BadRequestException(PRODUCT_HAS_OPTIONS)
            this.validateEnoughOptions(cartItem)
        } else if (
            !this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
            !this.productsValidator.validateIsHasOptions(cartItem.product.variants)
        ) {
            this.logger.error("in casessssssssss 222")
            if (cartItem.vrnt_id) throw new BadRequestException(PRODUCT_HAS_NO_OPTIONS)
            this.validateEnough(cartItem)
        }
    }
    validateEnough(cartItem: CartItem) {
        if (cartItem.vrnt_id) throw new BadRequestException(PRODUCT_INFORMATION_HAS_CHANGED)
        if (cartItem.quantity > cartItem.product.stock) {
            throw new BadRequestException(OUT_OF_STOCK)
        }

    }
    validateEnoughOptions(cartItem: CartItem) {
        if (!cartItem.vrnt_id) throw new BadRequestException(PRODUCT_INFORMATION_HAS_CHANGED)
        const variant = cartItem.product.variants.find(vrnt => vrnt.vrnt_id === cartItem.vrnt_id)
        if (!variant) throw new BadRequestException(PRODUCT_INFORMATION_HAS_CHANGED)
        if (
            cartItem.quantity > variant.stock
        ) {
            throw new BadRequestException(OUT_OF_STOCK)
        }

    }

}