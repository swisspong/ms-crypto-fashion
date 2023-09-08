import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { CartsRepository } from '../carts.repository';
import { CartItem, Product } from '../schemas/cart.schema';
import { MerchantStatus } from '@app/common/enums';
import { CheckoutsRepository } from './checkouts.repository';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class CheckoutsService {
    constructor(
        private readonly cartsRepository: CartsRepository,
        private readonly checkoutsRepository: CheckoutsRepository,
        // @Inject('PRODUCTS') private readonly productsClient: ClientProxy,
    ) { }
    private readonly uid = new ShortUniqueId()
    async createCheckoutItems(userId: string, createCheckoutDto: CreateCheckoutItemsDto) {
        let cart = await this.cartsRepository.findOne({
            user_id: userId
        })
        if (!cart) throw new NotFoundException("Cart not found.")
        const itemsSelecteds = cart.items.filter(item => createCheckoutDto.items.some(itemDto => itemDto === item.item_id))
        if (itemsSelecteds.length !== createCheckoutDto.items.length) throw new NotFoundException("Invalid item in cart.")
        itemsSelecteds.map(item => this.checkItem(item))
        await this.checkoutsRepository.create({
            user_id: userId,
            chkt_id: `chkt_${this.uid.stamp(15)}`,
            items: cart.items,

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
    async createOrder(chktId: string) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException("Cart not found.")
        checkout.items.map(chktItem => {
            const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === chktItem.item_id)
            if (cartItemIndex < 0) throw new NotFoundException("Product in cart not found.")
            const cartItem = cart.items[cartItemIndex]
            cart.items.splice(cartItemIndex, 1)
            if (
                chktItem.product.name === cartItem.product.name &&
                chktItem.product.prod_id === cartItem.product.prod_id &&
                chktItem.product.price === cartItem.product.price &&
                cartItem.product.available === true &&
                cartItem.product.groups.length === chktItem.product.groups.length &&
                cartItem.product.variants.length === chktItem.product.variants.length &&
                cartItem.quantity === chktItem.quantity &&
                (chktItem.vrnt_id ?
                    cartItem.vrnt_id === chktItem.vrnt_id ? cartItem.product.groups.every(cartGroup =>
                        chktItem.product.groups.some(chktGroup =>
                            cartGroup.vgrp_id === chktGroup.vgrp_id &&
                            cartGroup.name === chktGroup.name &&
                            cartGroup.options.length === chktGroup.options.length &&
                            cartGroup.options.every(cartOption =>
                                chktGroup.options.some(chktOption =>
                                    cartOption.name === chktOption.name &&
                                    cartOption.optn_id === chktOption.optn_id
                                )
                            )
                        )
                    ) &&
                        cartItem.product.variants.length === chktItem.product.variants.length &&
                        chktItem.product.variants.some(chktVariant => chktVariant.vrnt_id === chktVariant.vrnt_id) &&
                        cartItem.product.variants.some(cartVariant => cartVariant.vrnt_id === cartVariant.vrnt_id) &&
                        cartItem.product.variants.every(cartVariant =>
                            chktItem.product.variants.some(chktVariant =>
                                cartVariant.vrnt_id === chktVariant.vrnt_id &&
                                cartVariant.price === chktVariant.price &&
                                cartVariant.variant_selecteds.length === chktVariant.variant_selecteds.length &&
                                cartItem.product.groups.length === chktVariant.variant_selecteds.length
                            )
                        ) :
                        false :
                    cartItem.product.groups.length === 0 &&
                    chktItem.product.groups.length === 0 &&
                    cartItem.product.variants.length === 0 &&
                    chktItem.product.variants.length === 0
                )
            ) {
                if (chktItem.vrnt_id) {
                    const chktVariant = chktItem.product.variants.find(variant => chktItem.vrnt_id === variant.vrnt_id)
                    const cartVariant = cartItem.product.variants.find(variant => chktItem.vrnt_id === variant.vrnt_id)
                    if (chktItem.quantity > chktVariant.stock || cartItem.quantity > cartVariant.stock || chktItem.quantity > cartVariant.stock) throw new BadRequestException("Product not enough.")

                } else {
                    if (chktItem.quantity > chktItem.product.stock || cartItem.quantity > cartItem.product.stock || chktItem.quantity > cartItem.product.stock) throw new BadRequestException("Product not enough.")
                }

                
            } else {
                throw new BadRequestException("Product info has changed.")
            }
            // cartItem.


        })

    }
    checkItem(item: CartItem) {
        const product = item.product
        if (!product) throw new NotFoundException("Product not found.")
        if (!product.available) throw new NotFoundException('Product not available.')
        if (product.merchant.status !== MerchantStatus.OPENED) throw new NotFoundException('Merchant not available.')
        product.variants.map(variant => {
            if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
            variant.variant_selecteds.map(variant_selected => {
                const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
                if (!group) throw new BadRequestException("The option is invalid.")
                const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
                if (!option) throw new BadRequestException("The option is invalid.")
            })
        })
        if (item.vrnt_id) {
            if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
            const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
            if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
            variant.variant_selecteds.map(variant_selected => {
                const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
                if (!group) throw new BadRequestException("The option is invalid.")
                const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
                if (!option) throw new BadRequestException("The option is invalid.")
            })
            if (item.quantity > variant.stock) throw new BadRequestException("The product not enough.")

        } else {
            if (product.variants.length > 0) throw new BadRequestException("The product has options.")
            if (item.quantity > product.stock) throw new BadRequestException("The product not enough.")

        }
        return item
    }
}
