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
        itemsSelecteds.map(item => {
            const isValid = this.productsUtilService.isValid(item.product)
            if (!isValid) throw new BadRequestException("Product data has changed.")
            if (item.vrnt_id) {
                const variant = item.product.variants.find(vrnt => vrnt.vrnt_id === item.vrnt_id)
                if (!variant) throw new BadRequestException("Product data has changed.")
                if (item.quantity > variant.stock) throw new BadRequestException("Out of stock.")
            } else {
                if (item.quantity > item.product.stock) throw new BadRequestException("Out of stock.")
            }
        })
        // itemsSelecteds.map(item => this.checkItem(item))
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
            const cartItem = cart.items[cartItemIndex]
            cart.items.splice(cartItemIndex, 1)
            if (!this.productsUtilService.isEqual(chktItem.product, cartItem.product)) throw new BadRequestException("Product data has changed.")
            // cart item 
            const isValid = this.productsUtilService.isValid(cartItem.product)
            if (!isValid) throw new BadRequestException("Product data has changed.")
            if (cartItem.vrnt_id) {
                const variant = cartItem.product.variants.find(vrnt => vrnt.vrnt_id === cartItem.vrnt_id)
                if (!variant) throw new BadRequestException("Product data has changed.")
                if (cartItem.quantity > variant.stock) throw new BadRequestException("Out of stock.")
            } else {
                if (cartItem.quantity > cartItem.product.stock) throw new BadRequestException("Out of stock.")
            }
            // checkout item
            if (!this.productsUtilService.isValid(chktItem.product)) throw new BadRequestException("Product data has changed.")
            if (chktItem.vrnt_id) {
                const variant = chktItem.product.variants.find(vrnt => vrnt.vrnt_id === chktItem.vrnt_id)
                if (!variant) throw new BadRequestException("Product data has changed.")
                if (chktItem.quantity > variant.stock) throw new BadRequestException("Out of stock.")
            } else {
                if (chktItem.quantity > chktItem.product.stock) throw new BadRequestException("Out of stock.")
            }
            return chktItem
        })

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
    
    // checkItem(item: CartItem) {
    //     const product = item.product
    //     if (!product) throw new NotFoundException("Product not found.")
    //     if (!product.available) throw new NotFoundException('Product not available.')
    //     if (product.merchant.status !== MerchantStatus.OPENED) throw new NotFoundException('Merchant not available.')
    //     product.variants.map(variant => {
    //         if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
    //         variant.variant_selecteds.map(variant_selected => {
    //             const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
    //             if (!group) throw new BadRequestException("The option is invalid.")
    //             const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
    //             if (!option) throw new BadRequestException("The option is invalid.")
    //         })
    //     })
    //     if (item.vrnt_id) {
    //         if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
    //         const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
    //         if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
    //         variant.variant_selecteds.map(variant_selected => {
    //             const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
    //             if (!group) throw new BadRequestException("The option is invalid.")
    //             const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
    //             if (!option) throw new BadRequestException("The option is invalid.")
    //         })
    //         if (item.quantity > variant.stock) throw new BadRequestException("The product not enough.")

    //     } else {
    //         if (product.variants.length > 0) throw new BadRequestException("The product has options.")
    //         if (item.quantity > product.stock) throw new BadRequestException("The product not enough.")

    //     }
    //     return item
    // }
}
