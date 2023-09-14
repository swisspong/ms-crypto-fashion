import { MerchantStatus } from "@app/common/enums"
import { ICartItem } from "@app/common/interfaces/carts.interface"
import { ProductsUtilService } from "../products/products-util.service"


export class CartsUtilService {
    constructor(private readonly productsUtilService: ProductsUtilService) { }
    isValidItem(cartItem: ICartItem) {
        if (cartItem.prod_id === cartItem.product.prod_id &&
            cartItem.product.available === true &&
            cartItem.product.merchant.status === MerchantStatus.OPENED
        ) {
            if (cartItem.vrnt_id) {
                if (
                    this.productsUtilService.isHasVariant(cartItem.product) &&
                    this.productsUtilService.isIncludeVariant(cartItem.product, cartItem.vrnt_id) &&
                    this.productsUtilService.isEnoughVariant(cartItem.product, cartItem.vrnt_id, cartItem.quantity)
                ) {
                    return true
                }
            } else {
                if (
                    !this.productsUtilService.isHasVariant(cartItem.product) &&
                    this.productsUtilService.isEnoughStock(cartItem.product, cartItem.quantity)
                ) {
                    return true
                }
            }

        }
        return false
    }
}