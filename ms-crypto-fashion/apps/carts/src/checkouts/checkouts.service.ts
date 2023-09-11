import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { CartsRepository } from '../carts.repository';
import { CartItem, Product } from '../schemas/cart.schema';
import { MerchantStatus } from '@app/common/enums';
import { CheckoutsRepository } from './checkouts.repository';
import ShortUniqueId from 'short-unique-id';
import { OrderingDto } from './dto/ordering.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERING_EVENT, ORDER_SERVICE } from '@app/common/constants/order.constant';
import { ProductsUtilService } from '@app/common/utils/products/products-util.service';
import { CheckoutItem } from './schemas/checkout.schema';

@Injectable()
export class CheckoutsService {
    constructor(
        private readonly cartsRepository: CartsRepository,
        private readonly checkoutsRepository: CheckoutsRepository,
        private readonly productsUtilService: ProductsUtilService,
        @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
    ) { }
    private readonly uid = new ShortUniqueId()
    async createCheckoutItems(userId: string, createCheckoutDto: CreateCheckoutItemsDto) {
        let cart = await this.cartsRepository.findOne({
            user_id: userId
        })
        if (!cart) throw new NotFoundException("Cart not found.")
        const itemsSelecteds = cart.items.filter(item => createCheckoutDto.items.some(itemDto => itemDto === item.item_id))
        if (itemsSelecteds.length !== createCheckoutDto.items.length) throw new NotFoundException("Invalid item in cart.")

        const errorItems: CartItem[] = []
        this.filterItem(errorItems, itemsSelecteds)
        if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")

        await this.checkoutsRepository.create({
            user_id: userId,
            chkt_id: `chkt_${this.uid.stamp(15)}`,
            items: cart.items.map(item => {
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
        return {
            message: "success"
        }
    }
    async getCheckout(chkt_id: string) {
        const checkout = await this.checkoutsRepository.find({ chkt_id })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        return checkout
    }
    async createOrder(chktId: string, orderingDto: OrderingDto) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException("Cart not found.")
        checkout.items.map(chktItem => {
            const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === chktItem.item_id)
            if (cartItemIndex < 0) throw new NotFoundException("Product in cart not found.")
            const cartItem = cart.items.splice(cartItemIndex, 1)[0]
            if (!this.productsUtilService.isEqual(chktItem.product, cartItem.product)) throw new BadRequestException("Product data has changed.")
        })
        const errorItems = []

        this.filterItem(errorItems, checkout.items)

        if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")
        // checkout.items.map(chktItem => {
        //     const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === chktItem.item_id)
        //     if (cartItemIndex < 0) throw new NotFoundException("Product in cart not found.")
        //     const cartItem = cart.items[cartItemIndex]
        //     cart.items.splice(cartItemIndex, 1)
        //     if (!this.productsUtilService.isEqual(chktItem.product, cartItem.product)) throw new BadRequestException("Product data has changed.")
        //     // cart item 
        //     const isValid = this.productsUtilService.isValid(cartItem.product)
        //     if (!isValid) throw new BadRequestException("Product data has changed.")
        //     if (cartItem.vrnt_id) {
        //         const variant = cartItem.product.variants.find(vrnt => vrnt.vrnt_id === cartItem.vrnt_id)
        //         if (!variant) throw new BadRequestException("Product data has changed.")
        //         if (cartItem.quantity > variant.stock) throw new BadRequestException("Out of stock.")
        //     } else {
        //         if (cartItem.quantity > cartItem.product.stock) throw new BadRequestException("Out of stock.")
        //     }
        //     // checkout item
        //     if (!this.productsUtilService.isValid(chktItem.product)) throw new BadRequestException("Product data has changed.")
        //     if (chktItem.vrnt_id) {
        //         const variant = chktItem.product.variants.find(vrnt => vrnt.vrnt_id === chktItem.vrnt_id)
        //         if (!variant) throw new BadRequestException("Product data has changed.")
        //         if (chktItem.quantity > variant.stock) throw new BadRequestException("Out of stock.")
        //     } else {
        //         if (chktItem.quantity > chktItem.product.stock) throw new BadRequestException("Out of stock.")
        //     }
        //     return chktItem
        // })

        await lastValueFrom(
            this.orderClient.emit(ORDERING_EVENT, {
                ...checkout,
                ...orderingDto
            })
        )

        return {
            message: 'success'
        }

    }
    isValidItem(cartItem: CartItem) {
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

    filterItem(errorItems: CartItem[], items: CartItem[]) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (this.productsUtilService.isValid(item.product) && this.isValidItem(item)) {

            }
            let tmpIndex = i
            --i
            const errorItem = items.splice(tmpIndex, 1)[0]
            errorItems.push(errorItem)
        }
    }
}
