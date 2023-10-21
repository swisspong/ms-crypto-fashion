import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { CartsRepository } from '../carts.repository';
import {
    CartItem, PaymentMethodFormat,
    // Product
} from '../schemas/cart.schema';
import { MerchantStatus } from '@app/common/enums';
import { CheckoutsRepository } from './checkouts.repository';
import ShortUniqueId from 'short-unique-id';
import { OrderingDto } from './dto/ordering.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERING_EVENT, ORDER_SERVICE } from '@app/common/constants/order.constant';
import { ProductsUtilService } from '@app/common/utils/products/products-util.service';
import { CheckoutItem } from './schemas/checkout.schema';
import axios from 'axios';
import { CartItemsValidator } from '@app/common/utils/carts/cart-items-validator';
import { ProductsValidator } from '@app/common/utils/products/products-validator';
import { CART_NOT_FOUND, CHECKOUT_NOT_FOUND, INVALID_ITEM_IN_CART, INVALID_PAYMENT, PRODUCT_INFORMATION_HAS_CHANGED } from '@app/common/constants/error.constant';

@Injectable()
export class CheckoutsService {
    private readonly logger = new Logger(CheckoutsService.name)
    constructor(
        private readonly cartsRepository: CartsRepository,
        private readonly checkoutsRepository: CheckoutsRepository,
        //private readonly productsUtilService: ProductsUtilService,
        private readonly cartItemsValidator: CartItemsValidator,
        private readonly productsValidator: ProductsValidator,
        @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
    ) { }
    private readonly uid = new ShortUniqueId()



    async createCheckoutItems(userId: string, createCheckoutDto: CreateCheckoutItemsDto) {
        let cart = await this.cartsRepository.findOne({
            user_id: userId
        })

        if (!cart) throw new NotFoundException(CART_NOT_FOUND)
        const itemsSelecteds = cart.items.filter(item => createCheckoutDto.items.some(itemDto => itemDto === item.item_id))
        if (itemsSelecteds.length !== createCheckoutDto.items.length) throw new NotFoundException(INVALID_ITEM_IN_CART)
        for (const item of itemsSelecteds) {
            this.cartItemsValidator.validate(item)
            this.productsValidator.validateIncludePayment(item.product, createCheckoutDto.payment_method)
        }
        const checkout = await this.checkoutsRepository.create({
            user_id: userId,
            is_orederd: false,
            chkt_id: `chkt_${this.uid.stamp(15)}`,
            payment_method: createCheckoutDto.payment_method,
            items: itemsSelecteds.map(item => {
                const price = item.vrnt_id ? item.product.variants.find(variant => variant.vrnt_id === item.vrnt_id).price : item.product.price
                const variant = item.vrnt_id ? item.product.variants.find(vrnt => vrnt.vrnt_id === item.vrnt_id).variant_selecteds.map(vrnts => {
                    const group = item.product.groups.find(grp => grp.vgrp_id === vrnts.vgrp_id)
                    const option = group.options.find(optn => optn.optn_id === vrnts.optn_id)
                    return {
                        ...vrnts,
                        option_name: option.name,
                        group_name: group.name
                    }
                }) : []
                return {
                    ...item,
                    price,
                    total: price * item.quantity,
                    variant,
                    image: item.vrnt_id ? item.product.variants.find(vrnt => vrnt.vrnt_id === item.vrnt_id).image_url ?? item.product.image_urls[0] : item.product.image_urls[0]
                }
            }),

        })
        return checkout

    }
    // async createCheckoutItems(userId: string, createCheckoutDto: CreateCheckoutItemsDto) {
    //     let cart = await this.cartsRepository.findOne({
    //         user_id: userId
    //     })

    //     if (!cart) throw new NotFoundException("Cart not found.")
    //     const itemsSelecteds = cart.items.filter(item => createCheckoutDto.items.some(itemDto => itemDto === item.item_id))
    //     if (itemsSelecteds.length !== createCheckoutDto.items.length) throw new NotFoundException("Invalid item in cart.")
    //     const errorItems = this.filterErrorCartItem(createCheckoutDto.payment_method, itemsSelecteds)
    //     // for (const item of itemsSelecteds) {
    //     //     this.cartItemsValidator.validate(item)
    //     // }
    //     // const errorItems: CartItem[] = []
    //     // this.filterItem(errorItems, itemsSelecteds)
    //     // if (!itemsSelecteds.every(item => item.product.payment_methods.includes(createCheckoutDto.payment_method))) throw new BadRequestException("Product information is incorrect")
    //     if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")

    //     const checkout = await this.checkoutsRepository.create({
    //         user_id: userId,
    //         is_orederd: false,
    //         chkt_id: `chkt_${this.uid.stamp(15)}`,
    //         payment_method: createCheckoutDto.payment_method,
    //         items: itemsSelecteds.map(item => {
    //             const price = item.vrnt_id ? item.product.variants.find(variant => variant.vrnt_id === item.vrnt_id).price : item.product.price
    //             const variant = item.vrnt_id ? item.product.variants.find(vrnt => vrnt.vrnt_id === item.vrnt_id).variant_selecteds.map(vrnts => {
    //                 const group = item.product.groups.find(grp => grp.vgrp_id === vrnts.vgrp_id)
    //                 const option = group.options.find(optn => optn.optn_id === vrnts.optn_id)
    //                 return {
    //                     ...vrnts,
    //                     option_name: option.name,
    //                     group_name: group.name
    //                 }
    //             }) : []
    //             return {
    //                 ...item,
    //                 price,
    //                 total: price * item.quantity,
    //                 variant,
    //                 image: item.vrnt_id ? item.product.variants.find(vrnt => vrnt.vrnt_id === item.vrnt_id).image_url ?? item.product.image_urls[0] : item.product.image_urls[0]
    //             }
    //         }),

    //     })
    //     return checkout

    // }
    async getCheckout(chkt_id: string) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id })
        if (!checkout) throw new NotFoundException(CHECKOUT_NOT_FOUND)
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException(CART_NOT_FOUND)



        const errorItems = this.filterErrorItem(checkout.payment_method, checkout.items, cart.items)

        return {
            chkt_id: checkout.chkt_id,
            user_id: checkout.user_id,
            payment_method: checkout.payment_method,
            total_quantity: checkout.items.reduce((prev, curr) => prev + curr.quantity, 0),
            total: checkout.items.reduce((prev, curr) => prev + curr.total, 0),
            items: checkout.items,
            errorItems: checkout.payment_method === PaymentMethodFormat.WALLET && checkout.is_orederd === true ? [] : errorItems
        }
    }
    async deleteCheckout(userId: string, chktId: string) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId, user_id: userId })
        if (!checkout) throw new NotFoundException(CHECKOUT_NOT_FOUND)
        await this.checkoutsRepository.findOneAndDelete({ chkt_id: chktId, user_id: userId })
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException(CART_NOT_FOUND)


        const errorItems = this.filterErrorItem(checkout.payment_method, checkout.items, cart.items)
        cart.items = cart.items.filter(item => !errorItems.some(errItem => item.item_id === errItem.item_id))

        await this.cartsRepository.findOneAndUpdate({ _id: cart._id }, { $set: { items: cart.items } })
        return {
            message: "success"
        }
    }
    async createOrder(userId: string, chktId: string, orderingDto: OrderingDto) {
        try {

            const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId, user_id: userId })
            if (!checkout) throw new NotFoundException(CHECKOUT_NOT_FOUND)
            const cart = await this.cartsRepository.findOne({ user_id: userId })
            if (!cart) throw new NotFoundException(CART_NOT_FOUND)
            const errorItems = this.filterErrorItem(checkout.payment_method, checkout.items, cart.items)
            if (!orderingDto.token && orderingDto.payment_method === PaymentMethodFormat.CREDIT) {
                throw new BadRequestException(INVALID_PAYMENT)
            }
            if (checkout.payment_method === PaymentMethodFormat.WALLET && !checkout.is_orederd) {
                await this.checkoutsRepository.findAndUpdate({ _id: checkout._id }, { $set: { is_orederd: true } })

            }
            if (errorItems.length > 0) {
                throw new BadRequestException(PRODUCT_INFORMATION_HAS_CHANGED)
                //  await this.cartsRepository.findOneAndUpdate({ _id: cart._id }, { $set: { items: cart.items } })
            } else {
                this.logger.warn("emit event ordering")
                await lastValueFrom(
                    this.orderClient.emit(ORDERING_EVENT, {
                        ...checkout,
                        ...orderingDto
                    })
                )

            }

            if (errorItems.length > 0)
                if (orderingDto.payment_method === PaymentMethodFormat.WALLET) {

                    // const orders = await Promise.all(newOrders.map(async order => ({ orderId: order.order_id, total: order.total, wei: await this.getWei(order.total) })))
                    // return { data: orders }
                }
            return {
                //chkt_id: errorItems.length > 0 ? checkout.chkt_id : undefined
            }
        } catch (error) {
            this.logger.error(error)
            throw error
        }

    }
    // isValidItem(cartItem: CartItem) {
    //     if (
    //         cartItem.prod_id === cartItem.product.prod_id &&
    //         cartItem.product.available === true &&
    //         cartItem.product.merchant.status === MerchantStatus.OPENED
    //     ) {
    //         if (
    //             cartItem.vrnt_id &&
    //             this.productsUtilService.isHasVariant(cartItem.product) &&
    //             this.productsUtilService.isIncludeVariant(cartItem.product, cartItem.vrnt_id) &&
    //             this.productsUtilService.isEnoughVariant(cartItem.product, cartItem.vrnt_id, cartItem.quantity)
    //         ) {
    //             return true
    //         } else if (
    //             !this.productsUtilService.isHasVariant(cartItem.product) &&
    //             this.productsUtilService.isEnoughStock(cartItem.product, cartItem.quantity)
    //         ) {
    //             return true
    //         }

    //     }
    //     return false
    // }

    // filterItem(errorItems: CartItem[], items: CartItem[]) {
    //     for (let i = 0; i < items.length; i++) {
    //         const item = items[i]
    //         if (!this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
    //             let tmpIndex = i
    //             --i
    //             const errorItem = items.splice(tmpIndex, 1)[0]
    //             errorItems.push(errorItem)
    //         }
    //     }
    // }
    // filterErrorCartItem(paymentMethod: string, cartItems: CartItem[]) {
    //     return cartItems.filter(cartItem => {
    //         if (
    //             !this.productsUtilService.isValid(cartItem.product) ||
    //             !this.isValidItem(cartItem) ||
    //             !cartItem.product.payment_methods.includes(paymentMethod)
    //         )
    //             return true

    //     })

    // }
    filterErrorItem(paymentMethod: string, chktItems: CartItem[], cartItems: CartItem[]) {
        return chktItems.filter(chktItem => {
            const cartItem = cartItems.find(cartItem => cartItem.item_id === chktItem.item_id)
            try {
                this.cartItemsValidator.validate(cartItem)
                this.productsValidator.validateIncludePayment(cartItem.product, paymentMethod)
                this.cartItemsValidator.validate(chktItem)
                this.productsValidator.validateIncludePayment(chktItem.product, paymentMethod)
                this.productsValidator.validateEquality(chktItem.product, cartItem.product)
            } catch (error) {
                return true
            }

            return false

        })
    }
    // filterErrorItem(paymentMethod: string, chktItems: CartItem[], cartItems: CartItem[]) {
    //     return chktItems.filter(chktItem => {
    //         const cartItem = cartItems.find(cartItem => cartItem.item_id === chktItem.item_id)
    //         if (
    //             !cartItem ||
    //             !this.productsUtilService.isValid(cartItem.product) ||
    //             !this.isValidItem(cartItem) ||
    //             !cartItem.product.payment_methods.includes(paymentMethod) ||
    //             //chktItem
    //             !this.productsUtilService.isValid(chktItem.product) ||
    //             !this.isValidItem(chktItem) ||
    //             !chktItem.product.payment_methods.includes(paymentMethod) ||
    //             !this.productsUtilService.isEqual(chktItem.product, cartItem.product)
    //         ) {
    //             return true
    //         }
    //         if (
    //             chktItem.vrnt_id &&
    //             this.productsUtilService.isHasVariant(chktItem.product) &&
    //             this.productsUtilService.isHasVariant(cartItem.product)

    //         ) {
    //             const variantInCart = cartItem.product.variants.find(variant => variant.vrnt_id === chktItem.vrnt_id)
    //             if (!variantInCart || chktItem.quantity > variantInCart.stock) return true
    //         } else if (
    //             this.productsUtilService.isHasVariant(chktItem.product) ||
    //             this.productsUtilService.isHasVariant(cartItem.product) ||
    //             chktItem.quantity > cartItem.product.stock
    //         ) {
    //             return true
    //         }
    //         return false

    //     })
    // }
}
