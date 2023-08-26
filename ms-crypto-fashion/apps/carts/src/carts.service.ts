import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartsRepository } from './carts.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name)
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly cartsRepository: CartsRepository,
    @Inject('PRODUCTS') private readonly productsClient: ClientProxy,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }
  async addToCart(userId: string, productId: string, addToCartDto: AddToCartDto) {
    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    if (!cart) throw new NotFoundException("Cart not found.")
    const product = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: productId }));
    this.logger.log("res from product =>", test)
    // const product = await this.productsRepository.findOne({ prod_id: productId }, ["merchant"])
    // if (!product) throw new NotFoundException("Product not found.")
    // if (!product.available) throw new BadRequestException("Product not available.")
    // // if (product.stock <= 0) throw new BadRequestException("stock not enough.")
    // if (product.merchant.status !== MerchantStatus.OPENED) throw new BadRequestException("Merchant not available.")
    // product.variants.map(variant => {
    //   if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
    //   variant.variant_selecteds.map(variant_selected => {
    //     const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
    //     if (!group) throw new BadRequestException("The option is invalid.")
    //     const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
    //     if (!option) throw new BadRequestException("The option is invalid.")
    //   })
    // })

    // const existIndex = cart.items.findIndex(item => {
    //   if (item.product.toString() === product._id.toString()) {
    //     if (addToCartDto.vrnt_id) {

    //       if (item.vrnt_id === addToCartDto.vrnt_id) return true;
    //       return false
    //     } else {

    //       if (product.stock < item.quantity + addToCartDto.quantity) throw new BadRequestException("The product not enough.")
    //       return true
    //     }
    //   }
    //   return false
    // })
    // if (addToCartDto.vrnt_id) {
    //   if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
    //   const variant = product.variants.find(variant => variant.vrnt_id === addToCartDto.vrnt_id)
    //   if (!variant) throw new NotFoundException("Variant not found.")
    //   if (variant.variant_selecteds.length <= 0) throw new BadRequestException("The option is invalid.")
    //   variant.variant_selecteds.map(variant_selected => {
    //     const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
    //     if (!group) throw new BadRequestException("The option is invalid.")
    //     const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
    //     if (!option) throw new BadRequestException("The option is invalid.")
    //   })
    //   if (existIndex >= 0) {
    //     cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
    //     if ( cart.items[existIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

    //   } else {
    //     const newItem = new CartItem()
    //     newItem.item_id = `item_${this.uid.stamp(15)}`
    //     newItem.product = product._id
    //     newItem.quantity = addToCartDto.quantity
    //     newItem.vrnt_id = addToCartDto.vrnt_id
    //     if (newItem.quantity > variant.stock) throw new BadRequestException("The product not enough.")
    //     cart.items.push(newItem)


    //   }
    // } else {
    //   if (product.variants.length > 0) throw new BadRequestException("The product has options.")
    //   if (existIndex >= 0) {
    //     cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
    //     if (cart.items[existIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")


    //   } else {
    //     const newItem = new CartItem()
    //     newItem.item_id = `item_${this.uid.stamp(15)}`
    //     newItem.product = product._id
    //     newItem.quantity = addToCartDto.quantity
    //     if (newItem.quantity > product.stock) throw new BadRequestException("The product not enough.")
    //     cart.items.push(newItem)


    //   }
    // }
    // const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    // return newCart




  }
}
