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
    private readonly logger = new Logger(CheckoutsService.name)
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
        if (!itemsSelecteds.every(item => item.product.payment_methods.includes(createCheckoutDto.payment_method))) throw new BadRequestException("Product information is incorrect")
        if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")

        const checkout = await this.checkoutsRepository.create({
            user_id: userId,
            chkt_id: `chkt_${this.uid.stamp(15)}`,
            payment_method: createCheckoutDto.payment_method,
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
        return checkout

    }
    async getCheckout(chkt_id: string) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException("Cart not found.")


        // checkout.items.map(chktItem => {
        //     const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === chktItem.item_id)
        //     if (cartItemIndex < 0) throw new NotFoundException("Product in cart not found.")
        //     const cartItem = cart.items.splice(cartItemIndex, 1)[0]
        //     if (!this.productsUtilService.isEqual(chktItem.product, cartItem.product)) throw new BadRequestException("Product data has changed.")
        // })
        const errorItems = []
        for (let i = 0; i < checkout.items.length; i++) {
            const item = checkout.items[i]
            const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === item.item_id)

            if (cartItemIndex < 0 || !this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            const cartItem = cart.items.splice(cartItemIndex, 1)[0]
            if (!this.productsUtilService.isValid(cartItem.product) || !this.productsUtilService.isEqual(item.product, cartItem.product)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            if (item.vrnt_id) {
                const variant = cartItem.product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
                if (variant) {
                    if (item.quantity > variant.stock) {
                        let tmpIndex = i
                        --i
                        const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                        errorItems.push(errorItem)
                        continue
                    }
                }
            } else {
                if (item.quantity > cartItem.product.stock) {
                    let tmpIndex = i
                    --i
                    const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                    errorItems.push(errorItem)
                    continue
                }
            }
            if (!cartItem.product.payment_methods.includes(checkout.payment_method)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
        }


        // cartItemSelecteds.every(cartItem => cartItem.product.payment_methods.includes(checkout.payment_method))
        //this.filterItem(errorItems, checkout.items)

        // if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")
        return {
            chkt_id: checkout.chkt_id,
            user_id: checkout.user_id,
            payment_method: checkout.payment_method,
            total_quantity: checkout.items.reduce((prev, curr) => prev + curr.quantity, 0),
            total: checkout.items.reduce((prev, curr) => prev + curr.total, 0),
            items: checkout.items,
            errorItems: errorItems
        }
    }
    async deleteCheckout(userId: string, chktId: string) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId, user_id: userId })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        await this.checkoutsRepository.findOneAndDelete({ chkt_id: chktId, user_id: userId })
        const cart = await this.cartsRepository.findOne({ user_id: checkout.user_id })
        if (!cart) throw new NotFoundException("Cart not found.")

        const errorItems: CartItem[] = []

        // for (let i = 0; i < checkout.items.length; i++) {
        //     const item = checkout.items[i]
        //     const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === item.item_id)
        //     if (cartItemIndex < 0 || !this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
        //         let tmpIndex = i
        //         --i
        //         const errorItem = checkout.items.splice(tmpIndex, 1)[0]
        //         errorItems.push(errorItem)
        //         continue
        //     }
        //     const cartItem = cart.items.splice(cartItemIndex, 1)[0]
        //     if (!this.productsUtilService.isValid(cartItem.product) || !this.productsUtilService.isEqual(item.product, cartItem.product)) {
        //         let tmpIndex = i
        //         --i
        //         const errorItem = checkout.items.splice(tmpIndex, 1)[0]
        //         errorItems.push(errorItem)
        //     }
        // }
        for (let i = 0; i < checkout.items.length; i++) {
            const item = checkout.items[i]
            const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === item.item_id)

            if (cartItemIndex < 0 || !this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            const cartItem = cart.items.splice(cartItemIndex, 1)[0]
            if (!this.productsUtilService.isValid(cartItem.product) || !this.productsUtilService.isEqual(item.product, cartItem.product)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            if (item.vrnt_id) {
                const variant = cartItem.product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
                if (variant) {
                    if (item.quantity > variant.stock) {
                        let tmpIndex = i
                        --i
                        const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                        errorItems.push(errorItem)
                        continue
                    }
                }
            } else {
                if (item.quantity > cartItem.product.stock) {
                    let tmpIndex = i
                    --i
                    const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                    errorItems.push(errorItem)
                    continue
                }
            }
            if (!cartItem.product.payment_methods.includes(checkout.payment_method)) {
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
        }
        cart.items = cart.items.filter(item => !errorItems.some(errItem => item.item_id === errItem.item_id))

        await this.cartsRepository.findOneAndUpdate({ _id: cart._id }, { $set: { items: cart.items } })
        return {
            message: "success"
        }
    }
    async createOrder(userId: string, chktId: string, orderingDto: OrderingDto) {
        const checkout = await this.checkoutsRepository.findOne({ chkt_id: chktId, user_id: userId })
        if (!checkout) throw new NotFoundException("Checkout not found.")
        const cart = await this.cartsRepository.findOne({ user_id: userId })
        if (!cart) throw new NotFoundException("Cart not found.")
        // checkout.items.map(chktItem => {
        //     const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === chktItem.item_id)
        //     if (cartItemIndex < 0) throw new NotFoundException("Product in cart not found.")
        //     const cartItem = cart.items.splice(cartItemIndex, 1)[0]
        //     if (!this.productsUtilService.isEqual(chktItem.product, cartItem.product)) throw new BadRequestException("Product data has changed.")
        // })
        const errorItems = []

        //  this.filterItem(errorItems, checkout.items)

        for (let i = 0; i < checkout.items.length; i++) {
            const item = checkout.items[i]
            const cartItemIndex = cart.items.findIndex(cartItem => cartItem.item_id === item.item_id)
            this.logger.warn(cart,item.item_id)
            if (cartItemIndex < 0 || !this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
                this.logger.warn("1 check",cartItemIndex)
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            const cartItem = cart.items.splice(cartItemIndex, 1)[0]
            if (!this.productsUtilService.isValid(cartItem.product) || !this.productsUtilService.isEqual(item.product, cartItem.product)) {
                this.logger.warn("2 check")
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
            if (item.vrnt_id) {
                const variant = cartItem.product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
                if (variant) {
                    this.logger.warn("quantity variant  check ")
                    if (item.quantity > variant.stock) {
                        let tmpIndex = i
                        --i
                        const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                        errorItems.push(errorItem)
                        continue
                    }
                }
            } else {
                if (item.quantity > cartItem.product.stock) {
                    this.logger.warn("quantity check ")
                    let tmpIndex = i
                    --i
                    const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                    errorItems.push(errorItem)
                    continue
                }
            }
            if (!cartItem.product.payment_methods.includes(checkout.payment_method)) {
                this.logger.warn("payemnt check ")
                let tmpIndex = i
                --i
                const errorItem = checkout.items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
                continue
            }
        }



        // if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")
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

        cart.items = cart.items.filter(item => !errorItems.some(errItem => item.item_id === errItem.item_id))
        if (errorItems.length > 0) {
          //  await this.cartsRepository.findOneAndUpdate({ _id: cart._id }, { $set: { items: cart.items } })
        } else {
            await lastValueFrom(
                this.orderClient.emit(ORDERING_EVENT, {
                    ...checkout,
                    ...orderingDto
                })
            )
        }
        
        if (errorItems.length > 0) throw new BadRequestException("Product information is incorrect")
        return {
            //chkt_id: errorItems.length > 0 ? checkout.chkt_id : undefined
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
            if (!this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
                let tmpIndex = i
                --i
                const errorItem = items.splice(tmpIndex, 1)[0]
                errorItems.push(errorItem)
            }
        }
    }
}
