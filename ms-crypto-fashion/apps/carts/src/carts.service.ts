import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartsRepository } from './carts.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import ShortUniqueId from 'short-unique-id';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MerchantStatus } from '@app/common/enums';
import { CartItem } from './schemas/cart.schema';
import { ProductPayloadDataEvent } from '@app/common/interfaces/products-event.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateCheckoutItemsDto } from './dto/create-checkout.dto';
import { PRODUCTS_TCP } from '@app/common/constants/products.constant';
import { IProduct } from '@app/common/interfaces/order-event.interface';
import { ProductsUtilService } from '@app/common/utils/products/products-util.service';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name)
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly cartsRepository: CartsRepository,
    @Inject(PRODUCTS_TCP) private readonly productsClient: ClientProxy,
    private readonly productsUtilService: ProductsUtilService
  ) { }

  async updateCartItemEvent(data: ProductPayloadDataEvent) {
    const { description, sku, ...product } = data
    await this.cartsRepository.findAndUpdate({ "items.prod_id": product.prod_id }, { '$set': { 'items.$.product': product } })

  }


  async findCartByUserId(userId: string) {

    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    return cart.items
    // const { data: products } = await lastValueFrom(this.productsClient.send({ cmd: 'check_product_list' }, { items: cart.items.map(item => ({ prod_id: item.prod_id, quantity: item.quantity, vrnt_id: item.vrnt_id })) }));
    // return products.map(product => {
    //   const item = cart.items.find(item => item.prod_id === product.prod_id)
    //   return { ...item, product }
    // })
  }
  async addToCart(userId: string, productId: string, addToCartDto: AddToCartDto) {
    //fix if product is exist not request to product server
    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    if (!cart) throw new NotFoundException("Cart not found.")
    const { data: product }: { data: IProduct } = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: productId }));
    this.logger.log("res from product =>", product)
    if (!product) throw new NotFoundException("Product not found.")
    if (!product.available) throw new BadRequestException("Product not available.")
    // if (product.stock <= 0) throw new BadRequestException("stock not enough.")
    this.logger.warn(product.merchant)
    if (product.merchant.status !== MerchantStatus.OPENED) throw new BadRequestException("Merchant not available.")

    if (!this.productsUtilService.isValid(product)) throw new BadRequestException("Product data has changed.")

    const existIndex = cart.items.findIndex(item => {
      if (item.prod_id === product.prod_id) {
        if (product.variants.length > 0 && item.vrnt_id && item.vrnt_id === addToCartDto.vrnt_id && this.productsUtilService.isIncludeVariant(product, item.vrnt_id)) {
          return true
        } else if (product.variants.length <= 0 && !item.vrnt_id) {
          return true
        }
      }
      return false
    })
    if (addToCartDto.vrnt_id) {
      if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
      const variant = product.variants.find(variant => variant.vrnt_id === addToCartDto.vrnt_id)
      if (!variant) throw new NotFoundException("Variant not found.")

      if (existIndex >= 0) {
        cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
        if (cart.items[existIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

      } else {
        const newItem = new CartItem()
        newItem.item_id = `item_${this.uid.stamp(15)}`
        newItem.prod_id = product.prod_id
        newItem.quantity = addToCartDto.quantity
        newItem.vrnt_id = addToCartDto.vrnt_id
        if (newItem.quantity > variant.stock) throw new BadRequestException("The product not enough.")
        cart.items.push(newItem)
      }
    } else {
      if (product.variants.length > 0) throw new BadRequestException("The product has options.")
      if (existIndex >= 0) {
        cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
        if (cart.items[existIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")


      } else {
        const newItem = new CartItem()
        newItem.item_id = `item_${this.uid.stamp(15)}`
        newItem.prod_id = product.prod_id
        newItem.quantity = addToCartDto.quantity
        const { description, sku, ...prod } = product as any
        newItem.product = prod
        if (newItem.quantity > product.stock) throw new BadRequestException("The product not enough.")
        cart.items.push(newItem)


      }
    }
    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart




  }
  async update(userId: string, itemId: string, updateCartDto: UpdateCartItemDto) {

    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    const existItemIndex = cart.items.findIndex(item => item.item_id === itemId)
    if (existItemIndex < 0) throw new NotFoundException("Item not found.")
    const existItem = cart.items[existItemIndex]
    const product = existItem.product

    if (!product) throw new NotFoundException("Product not found.")
    if (!product.available) throw new BadRequestException("Product not available.")

    if (product.merchant.status !== MerchantStatus.OPENED) throw new BadRequestException("Merchant not available.")

    if (!this.productsUtilService.isValid(product)) throw new BadRequestException("Products data has changed.")

    if (updateCartDto.vrnt_id) {
      if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
      const variant = product.variants.find(variant => variant.vrnt_id === updateCartDto.vrnt_id)
      if (!variant) throw new NotFoundException("Variant not found.")
      cart.items[existItemIndex].quantity = updateCartDto.quantity
      if (cart.items[existItemIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

      if (cart.items[existItemIndex].vrnt_id !== updateCartDto.vrnt_id) {
        const itemDuplicate = cart.items.find(item => {
          if ((item.product as any)._id === (cart.items[existItemIndex].product as any)._id) {
            if (item.vrnt_id === updateCartDto.vrnt_id) {
              return true
            }
          }
          return false
        })
        if (itemDuplicate) throw new BadRequestException("Item already exist.")
      }
      cart.items[existItemIndex].vrnt_id = updateCartDto.vrnt_id
    } else {
      if (product.variants.length > 0) throw new BadRequestException("The product has options.")
      cart.items[existItemIndex].quantity = updateCartDto.quantity
      if (cart.items[existItemIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")
    }


    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart


  }

  async remove(userId: string, itemId: string) {
    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    const itemIndex = cart.items.findIndex(item => item.item_id === itemId)
    if (itemIndex < 0) throw new BadRequestException("Item not found.")
    cart.items.splice(itemIndex, 1)
    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart
  }




}
