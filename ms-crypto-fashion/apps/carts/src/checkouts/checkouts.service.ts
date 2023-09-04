import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCheckoutItemsDto } from '../dto/create-checkout.dto';
import { CartsRepository } from '../carts.repository';
import { CartItem } from '../schemas/cart.schema';
import { MerchantStatus } from '@app/common/enums';

@Injectable()
export class CheckoutsService {
    constructor(
        private readonly cartsRepository: CartsRepository,
        // @Inject('PRODUCTS') private readonly productsClient: ClientProxy,
    ) { }
    async createCheckoutItems(userId: string, createCheckoutDto: CreateCheckoutItemsDto) {

        let cart = await this.cartsRepository.findOne({
            user_id: userId
        })
        if (!cart) throw new NotFoundException("Cart not found.")
        const itemsSelecteds = cart.items.filter(item => createCheckoutDto.items.some(itemDto => itemDto === item.item_id))
        if (itemsSelecteds.length !== createCheckoutDto.items.length) throw new NotFoundException("Invalid item in cart.")
        itemsSelecteds.map(item => this.checkItem(item))
        
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
