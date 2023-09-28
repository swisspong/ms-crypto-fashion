import { Injectable } from "@nestjs/common";
import { CartItem } from "apps/carts/src/schemas/cart.schema";
import { Product } from "apps/products/src/schemas/product.schema";
import { ProductsValidator } from "../products/products-validator";

@Injectable()
export class CartItemsValidator {
    constructor(private readonly productsValidator: ProductsValidator) { }
    validate(cartItem: CartItem) {
        this.productsValidator.validate(cartItem.product)
    
        if (
            this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
            this.productsValidator.validateIsHasOptions(cartItem.product.variants)
        ) {

            this.validateEnoughOptions(cartItem)
        } else if (
            !this.productsValidator.validateIsHasGroups(cartItem.product.groups) &&
            !this.productsValidator.validateIsHasOptions(cartItem.product.variants)
        ) {

            this.validateEnough(cartItem)
        }
    }
    validateEnough(cartItem: CartItem) {
        if (cartItem.vrnt_id) throw new Error("Product info has changed")
        if (cartItem.quantity > cartItem.product.stock) {
            throw new Error("Out of stock")
        }

    }
    validateEnoughOptions(cartItem: CartItem) {
        if (!cartItem.vrnt_id) throw new Error("Product info has changed")
        const variant = cartItem.product.variants.find(vrnt => vrnt.vrnt_id === cartItem.vrnt_id)
        if (!variant) throw new Error("Product info has changed.")
        if (
            cartItem.quantity > variant.stock
        ) {
            throw new Error("Out of stock")
        }

    }
  
}