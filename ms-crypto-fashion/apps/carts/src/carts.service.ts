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
import { PRODUCTS_SERVICE, PRODUCTS_TCP } from '@app/common/constants/products.constant';
import { IProduct } from '@app/common/interfaces/order-event.interface';
import { ProductsUtilService } from '@app/common/utils/products/products-util.service';
import { DeleteManyItemsDto } from './dto/delet-many-items.dto';
import { IDeleteChktEventPayload } from '@app/common/interfaces/carts.interface';
import { CheckoutsRepository } from './checkouts/checkouts.repository';
import { Product } from 'apps/products/src/schemas/product.schema';
import { ProductsValidator } from '@app/common/utils/products/products-validator';
import { CartItemsValidator } from '@app/common/utils/carts/cart-items-validator';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name)
  private readonly uid = new ShortUniqueId()
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly checkoutsRepository: CheckoutsRepository,
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    private readonly productsUtilService: ProductsUtilService,
    private readonly productsValidator: ProductsValidator,
    private readonly cartItemsValidator: CartItemsValidator
  ) { }

  async updateCartItemEvent(data: ProductPayloadDataEvent) {
    const { description, sku, ...product } = data
    await this.cartsRepository.findAndUpdate({ "items.prod_id": product.prod_id }, { '$set': { 'items.$.product': product } })

  }

  async deleteChktAndItems(data: IDeleteChktEventPayload) {
    const { chkt_id, user_id } = data
    const checkout = await this.checkoutsRepository.findOneAndDelete({ chkt_id, user_id })
    const cart = await this.cartsRepository.findOne({ user_id: user_id })
    cart.items = cart.items.filter(item => {
      const index = checkout.items.findIndex(chktItem => chktItem.item_id === item.item_id)
      if (index >= 0) {
        checkout.items.splice(index, 1)
        return false
      }
      return true
    })
    await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { $set: { items: cart.items } })
  }


  async findCartByUserId(userId: string) {

    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    const errorItems: CartItem[] = []
    this.logger.warn("cart item before => ", cart.items)
    this.filterItem(errorItems, cart.items)
    this.logger.warn("cart item after => ", cart.items)
    this.logger.warn("erorr item => ", errorItems)
    // if (errorItems.length > 0) {
    //   await this.cartsRepository.findOneAndUpdate({ user_id: userId }, { $set: { items: cart.items } })
    // }
    return { items: cart.items, errorItems: errorItems }
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
    const { data: product }: { data: Product } = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: productId }));
    this.logger.log("res from product =>", product)
    if (!product) throw new NotFoundException("Product not found.")
    this.productsValidator.validate(product)

    if (
      this.productsValidator.validateIsHasGroups(product.groups) &&
      this.productsValidator.validateIsHasOptions(product.variants)
    ) {
      if (!addToCartDto.vrnt_id) throw new BadRequestException("Product has options")
      this.productsValidator.validateIncludeOptions(product.variants, addToCartDto.vrnt_id)
    } else if (
      !this.productsValidator.validateIsHasGroups(product.groups) &&
      !this.productsValidator.validateIsHasOptions(product.variants)
    ) {
      if (addToCartDto.vrnt_id) {
        throw new BadRequestException("Product has no options")
      }
    }


    const existIndex = cart.items.findIndex(item => {
      if (item.prod_id === product.prod_id) {
        if (addToCartDto.vrnt_id) {
          if (item.vrnt_id === addToCartDto.vrnt_id) return true
        } else {
          return true
        }
      }
      return false
    })

    if (addToCartDto.vrnt_id) {
      const variant = product.variants.find(variant => variant.vrnt_id === addToCartDto.vrnt_id)
      if (existIndex >= 0) {
        cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
        // if (cart.items[existIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")
        this.cartItemsValidator.validate(cart.items[existIndex])
      } else {
        const newItem = new CartItem()
        newItem.item_id = `item_${this.uid.stamp(15)}`
        newItem.prod_id = product.prod_id
        newItem.quantity = addToCartDto.quantity
        newItem.vrnt_id = addToCartDto.vrnt_id
        newItem.product = product
        // if (newItem.quantity > variant.stock) throw new BadRequestException("The product not enough.")
        this.cartItemsValidator.validate(newItem)
        cart.items.push(newItem)
      }
    } else {
      if (existIndex >= 0) {
        cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
        this.cartItemsValidator.validate(cart.items[existIndex])
        //if (cart.items[existIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")


      } else {
        const newItem = new CartItem()
        newItem.item_id = `item_${this.uid.stamp(15)}`
        newItem.prod_id = product.prod_id
        newItem.quantity = addToCartDto.quantity
        newItem.product = product
        //if (newItem.quantity > product.stock) throw new BadRequestException("The product not enough.")
        this.cartItemsValidator.validate(newItem)
        cart.items.push(newItem)
      }
    }
    const errorItems: CartItem[] = []
    this.logger.warn("before call filter=> ", cart.items)
    cart.items = this.filterItem(errorItems, cart.items)
    this.logger.warn("after call filter=> ", cart.items)

    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart
  }
  // async addToCart(userId: string, productId: string, addToCartDto: AddToCartDto) {
  //   //fix if product is exist not request to product server
  //   let cart = await this.cartsRepository.findOne({ user_id: userId })
  //   cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
  //   if (!cart) throw new NotFoundException("Cart not found.")
  //   const { data: product }: { data: IProduct } = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: productId }));
  //   this.logger.log("res from product =>", product)
  //   if (!product) throw new NotFoundException("Product not found.")
  //   if (!product.available) throw new BadRequestException("Product not available.")
  //   // if (product.stock <= 0) throw new BadRequestException("stock not enough.")
  //   this.logger.warn(product.merchant)
  //   if (product.merchant.status !== MerchantStatus.OPENED) throw new BadRequestException("Merchant not available.")

  //   if (!this.productsUtilService.isValid(product)) throw new BadRequestException("Product data has changed.")

  //   const existIndex = cart.items.findIndex(item => {
  //     if (item.prod_id === product.prod_id) {
  //       if (addToCartDto.vrnt_id) {
  //         if (!this.productsUtilService.isHasVariant(product)) throw new BadRequestException("Product has no variant.")
  //         if (!this.productsUtilService.isIncludeVariant(product, addToCartDto.vrnt_id)) throw new NotFoundException("Variant not found.")
  //         if (item.vrnt_id === addToCartDto.vrnt_id) return true
  //       } else {
  //         if (!this.productsUtilService.isHasVariant(product)) {
  //           return true
  //         }
  //       }
  //     }
  //     return false
  //   })
  //   if (addToCartDto.vrnt_id) {
  //     if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
  //     const variant = product.variants.find(variant => variant.vrnt_id === addToCartDto.vrnt_id)
  //     if (!variant) throw new NotFoundException("Variant not found.")

  //     if (existIndex >= 0) {
  //       cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
  //       if (cart.items[existIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

  //     } else {
  //       const newItem = new CartItem()
  //       newItem.item_id = `item_${this.uid.stamp(15)}`
  //       newItem.prod_id = product.prod_id
  //       newItem.quantity = addToCartDto.quantity
  //       newItem.vrnt_id = addToCartDto.vrnt_id
  //       const { description, sku, ...prod } = product as any
  //       newItem.product = prod
  //       if (newItem.quantity > variant.stock) throw new BadRequestException("The product not enough.")
  //       cart.items.push(newItem)
  //     }
  //   } else {
  //     if (product.variants.length > 0) throw new BadRequestException("The product has options.")
  //     if (existIndex >= 0) {
  //       cart.items[existIndex].quantity = cart.items[existIndex].quantity + addToCartDto.quantity
  //       if (cart.items[existIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")


  //     } else {
  //       const newItem = new CartItem()
  //       newItem.item_id = `item_${this.uid.stamp(15)}`
  //       newItem.prod_id = product.prod_id
  //       newItem.quantity = addToCartDto.quantity
  //       const { description, sku, ...prod } = product as any
  //       newItem.product = prod
  //       if (newItem.quantity > product.stock) throw new BadRequestException("The product not enough.")
  //       cart.items.push(newItem)


  //     }
  //   }
  //   const errorItems: CartItem[] = []
  //   this.logger.warn("before call filter=> ", cart.items)
  //   this.filterItem(errorItems, cart.items)
  //   this.logger.warn("after call filter=> ", cart.items)

  //   const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
  //   return newCart




  // }
  async update(userId: string, itemId: string, updateCartDto: UpdateCartItemDto) {
    try {
      let cart = await this.cartsRepository.findOne({ user_id: userId })
      cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
      const existItemIndex = cart.items.findIndex(item => item.item_id === itemId)
      if (existItemIndex < 0) throw new NotFoundException("Item not found.")
      const existItem = cart.items[existItemIndex]
      const product = existItem.product

      if (!product) throw new NotFoundException("Product not found.")
      this.cartItemsValidator.validate(existItem)


      if (
        this.productsValidator.validateIsHasGroups(product.groups) &&
        this.productsValidator.validateIsHasOptions(product.variants)
      ) {
        if (!updateCartDto.vrnt_id) throw new BadRequestException("Product has options")
        this.productsValidator.validateIncludeOptions(product.variants, updateCartDto.vrnt_id)
      } else if (
        !this.productsValidator.validateIsHasGroups(product.groups) &&
        !this.productsValidator.validateIsHasOptions(product.variants)
      ) {
        if (updateCartDto.vrnt_id) {
          throw new BadRequestException("Product has no options")
        }
      }


      if (updateCartDto.vrnt_id) {

        cart.items[existItemIndex].quantity = updateCartDto.quantity
        this.cartItemsValidator.validate(cart.items[existItemIndex])
        // (cart.items[existItemIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

        if (cart.items[existItemIndex].vrnt_id !== updateCartDto.vrnt_id) {
          const itemDuplicate = cart.items.find(item => {
            if (item.product.prod_id === cart.items[existItemIndex].product.prod_id) {
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

        cart.items[existItemIndex].quantity = updateCartDto.quantity
        this.cartItemsValidator.validate(cart.items[existItemIndex])
        //  if (cart.items[existItemIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")
      }

      const errorItems: CartItem[] = []
      cart.items = this.filterItem(errorItems, cart.items)

      const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
      return newCart

    } catch (error) {
      this.logger.error(error)
      throw error
    }


  }
  // async update(userId: string, itemId: string, updateCartDto: UpdateCartItemDto) {

  //   let cart = await this.cartsRepository.findOne({ user_id: userId })
  //   cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
  //   const existItemIndex = cart.items.findIndex(item => item.item_id === itemId)
  //   if (existItemIndex < 0) throw new NotFoundException("Item not found.")
  //   const existItem = cart.items[existItemIndex]
  //   const product = existItem.product

  //   if (!product) throw new NotFoundException("Product not found.")
  //   if (!product.available) throw new BadRequestException("Product not available.")

  //   if (product.merchant.status !== MerchantStatus.OPENED) throw new BadRequestException("Merchant not available.")

  //   if (!this.productsUtilService.isValid(product)) throw new BadRequestException("Products data has changed.")

  //   if (updateCartDto.vrnt_id) {
  //     if (product.variants.length <= 0) throw new BadRequestException("The product has no options.")
  //     const variant = product.variants.find(variant => variant.vrnt_id === updateCartDto.vrnt_id)
  //     if (!variant) throw new NotFoundException("Variant not found.")
  //     cart.items[existItemIndex].quantity = updateCartDto.quantity
  //     if (cart.items[existItemIndex].quantity > variant.stock) throw new BadRequestException("The product not enough.")

  //     if (cart.items[existItemIndex].vrnt_id !== updateCartDto.vrnt_id) {
  //       const itemDuplicate = cart.items.find(item => {
  //         if (item.product.prod_id === cart.items[existItemIndex].product.prod_id) {
  //           if (item.vrnt_id === updateCartDto.vrnt_id) {
  //             return true
  //           }
  //         }
  //         return false
  //       })
  //       if (itemDuplicate) throw new BadRequestException("Item already exist.")
  //     }
  //     cart.items[existItemIndex].vrnt_id = updateCartDto.vrnt_id
  //   } else {
  //     if (product.variants.length > 0) throw new BadRequestException("The product has options.")
  //     cart.items[existItemIndex].quantity = updateCartDto.quantity
  //     if (cart.items[existItemIndex].quantity > product.stock) throw new BadRequestException("The product not enough.")
  //   }

  //   const errorItems: CartItem[] = []
  //   this.filterItem(errorItems, cart.items)

  //   const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
  //   return newCart


  // }

  async remove(userId: string, itemId: string) {
    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    const itemIndex = cart.items.findIndex(item => item.item_id === itemId)
    if (itemIndex < 0) throw new BadRequestException("Item not found.")
    cart.items.splice(itemIndex, 1)
    const errorItems: CartItem[] = []
    this.filterItem(errorItems, cart.items)
    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart
  }

  async removeMany(userId: string, dto: DeleteManyItemsDto) {
    let cart = await this.cartsRepository.findOne({ user_id: userId })
    cart = cart ? cart : await this.cartsRepository.create({ user_id: userId, cart_id: `cart_${this.uid.stamp(15)}`, items: [] })
    cart.items = cart.items.filter(item => !dto.items.some(id => id === item.item_id))
    const newCart = await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items })
    return newCart
  }

  // isValidItem(cartItem: CartItem) {
  //   if (cartItem.prod_id === cartItem.product.prod_id &&
  //     cartItem.product.available === true &&
  //     cartItem.product.merchant.status === MerchantStatus.OPENED
  //   ) {
  //     if (cartItem.vrnt_id) {
  //       if (
  //         this.productsUtilService.isHasVariant(cartItem.product) &&
  //         this.productsUtilService.isIncludeVariant(cartItem.product, cartItem.vrnt_id) &&
  //         this.productsUtilService.isEnoughVariant(cartItem.product, cartItem.vrnt_id, cartItem.quantity)
  //       ) {
  //         return true
  //       }
  //     } else {
  //       if (
  //         !this.productsUtilService.isHasVariant(cartItem.product) &&
  //         this.productsUtilService.isEnoughStock(cartItem.product, cartItem.quantity)
  //       ) {
  //         return true
  //       }
  //     }

  //   }
  //   return false
  // }
  filterItem(errorItems: CartItem[], items: CartItem[]) {
    const correctItems: CartItem[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      try {
        this.cartItemsValidator.validate(item)
        correctItems.push(item)
      } catch (error) {
        const errorItem = items[i]
        errorItems.push(errorItem)

      }
      // try {
      //   this.cartItemsValidator.validate(item)
      // } catch (error) {
      //   let tmpIndex = i
      //   --i
      //   const errorItem = items.splice(tmpIndex, 1)[0]
      //   errorItems.push(errorItem)

      // }


    }
    return correctItems
  }
  // filterItem(errorItems: CartItem[], items: CartItem[]) {
  //   for (let i = 0; i < items.length; i++) {
  //     const item = items[i]
  //     if (!this.productsUtilService.isValid(item.product) || !this.isValidItem(item)) {
  //       let tmpIndex = i
  //       --i
  //       const errorItem = items.splice(tmpIndex, 1)[0]
  //       errorItems.push(errorItem)
  //     }
  //   }
  // }

}
