import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository:OrdersRepository){}
  getHello(): string {
    return 'Hello World!';
  }
  // async getWei(priceTHB: number) {
  //   const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
  //   const rateInTHB = data.THB
  //   const rate = (1 * 10 ** 18) / rateInTHB
  //   const toWei = rate * priceTHB
  //   const rate2 = rateInTHB / (1 * 10 ** 18)
  //   const bath = toWei * rate2
  //   return { wei: Math.ceil(toWei), bath }
  // }
  // async ordering(userId: string, createOrderDto: CreateOrderDto) {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   let checkout = await this.checkoutsRepository.findOnePopulateNew({ user_id: userId, chkt_id: createOrderDto.chkt_id },
  //     [{
  //       model: "Product",
  //       foreignField: "prod_id",
  //       localField: "items.prod_id",
  //       path: 'items.prod_id',
  //       populate: {
  //         model: 'Merchant',
  //         foreignField: '_id',
  //         localField: "items.prod_id.merchant",

  //         path: "merchant"
  //       }
  //     }]
  //   ) as Checkout
  //   try {



  //     if (!checkout) throw new NotFoundException("Checkout not found.")
  //     // if (checkout.checkout_expired.getTime() < new Date().getTime()) throw new BadRequestException("Checkout exprired.")
  //     if (checkout.items.length <= 0) throw new BadRequestException("Checkout is empty.")



  //     const newCheckoutItem = checkout.items.map(item => {
  //       //return item
  //       const product = (item.prod_id as Product)
  //       if (!product) return this.formatItem(item, "Deleted.")
  //       if (!product.available) return this.formatItem(item, "Product not available.")
  //       // if (product.stock <= 0) return { item_id: item.item_id, quantity: item.quantity, vrnt_id: item.vrnt_id, product: item.product, message: "Out of stock." }
  //       if (product.merchant.status !== MerchantStatus.OPENED) return this.formatItem(item, "Merchant not available.")
  //       if (product.name !== item.name) return this.formatItem(item, "The product has changed.")

  //       const produtIsInvalid = product.variants.some(variant => {
  //         if (variant.variant_selecteds.length <= 0) return true
  //         const variantSelectedIsInvalid = variant.variant_selecteds.some(variant_selected => {
  //           const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
  //           if (!group) return true
  //           const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
  //           if (!option) return true
  //           return false
  //         })
  //         if (variantSelectedIsInvalid) return true
  //         return false
  //       })

  //       if (produtIsInvalid) return this.formatItem(item, "The product has changed.")
  //       if (item.vrnt_id) {
  //         if (product.variants.length <= 0) return this.formatItem(item, "The product has changed.")
  //         const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
  //         if (!variant) return this.formatItem(item, "The product has changed.")
  //         if (variant.variant_selecteds.length <= 0) return this.formatItem(item, "The product has changed.")
  //         if (variant.variant_selecteds.length !== item.variant.length) return this.formatItem(item, "The product has changed.")
  //         const variantSelectedIsInvalid = variant.variant_selecteds.some(variant_selected => {
  //           const group = product.groups.find(group => group.vgrp_id === variant_selected.vgrp_id)
  //           if (!group) return true
  //           if (!item.variant.some(vrnt => vrnt.group_name === group.name)) return true
  //           const option = group.options.find(option => option.optn_id === variant_selected.optn_id)
  //           if (!option) return true
  //           if (!item.variant.some(vrnt => vrnt.option_name === option.name)) return true
  //           return false
  //         })
  //         if (variantSelectedIsInvalid) return this.formatItem(item, "The product has changed.")
  //         if (item.price !== variant.price) return this.formatItem(item, "The product has changed.")
  //         if (item.image !== variant.image_url && item.image !== product.image_urls[0]) return this.formatItem(item, "The product has changed.")
  //         if (item.quantity > variant.stock || variant.stock <= 0) return this.formatItem(item, "Out of stock.")
  //       } else {
  //         if (product.variants.length > 0) return this.formatItem(item, "The product has changed.")
  //         if (item.price !== product.price) return this.formatItem(item, "The product has changed.")
  //         if (item.image !== product.image_urls[0]) return this.formatItem(item, "The product has changed.")
  //         if (item.quantity > product.stock || product.stock <= 0) return this.formatItem(item, "Out of stock.")
  //       }
  //       return this.formatItem(item)
  //     })

  //     if (newCheckoutItem.some(chktItem => chktItem.message)) {
  //       throw new BadRequestException("The product info has changed.")
  //     }
  //     const groupByMchtId = {}
  //     newCheckoutItem.forEach(checkoutItem => {
  //       const proudct = checkoutItem.product as Product
  //       const merchant = proudct.merchant
  //       // const mchtId = checkoutItem.product
  //       groupByMchtId[merchant.mcht_id] = groupByMchtId[merchant.mcht_id] ?? []
  //       groupByMchtId[merchant.mcht_id].push(checkoutItem)
  //     })
  //     const groups = Object.entries<CheckoutItem[]>(groupByMchtId)

  //     await Promise.all(newCheckoutItem.map(async (item) => {
  //       const newStock = -item.quantity
  //       if (item.vrnt_id) {
  //         const product = await this.productsRepository.findOneAndUpdate({ prod_id: (item.product as Product).prod_id, "variants.vrnt_id": item.vrnt_id }, { $inc: { "variants.$.stock": newStock } }, session)
  //         if (!product) throw new BadRequestException("Product info has changed")
  //         const variant = product.variants.find(variant => variant.vrnt_id === item.vrnt_id)
  //         if (!variant) throw new BadRequestException("Product info has changed")
  //         if (variant.stock < 0) throw new BadRequestException("Product info has chagned")
  //         return product
  //         // await this.productsRepository.updateOne({ prod_id: item.product.prod_id, "variants.vrnt_id": item.vrnt_id }, { $inc: { "variants.$.stock": newStock } })
  //       }
  //       const newProduct = await this.productsRepository.findOneAndUpdate({ prod_id: (item.product as Product).prod_id }, { $inc: { stock: newStock } }, session)
  //       if (!newProduct) throw new BadRequestException("Product info has changed")
  //       if (newProduct.stock < 0) throw new BadRequestException("Out of stock")
  //       // console.log(newProduct)
  //       return newProduct
  //     }))

  //     const orders = groups.map(group => {
  //       const order = new Order()
  //       const product = (group[1][0] as any).product as Product
  //       const merchant = product.merchant
  //       if (createOrderDto.payment_method === PaymentMethodFormat.WALLET) {
  //         order.payment_status = PaymentFormat.PENDING
  //       }
  //       order.user_id = userId
  //       order.order_id = `order_${this.uid.stamp(15)}`
  //       order.address = createOrderDto.address
  //       order.post_code = createOrderDto.post_code
  //       order.recipient = createOrderDto.recipient
  //       order.tel_number = createOrderDto.tel_number
  //       order.items = group[1].map(chktItem => {
  //         const orderItem = new OrderItem()
  //         orderItem.item_id = chktItem.item_id
  //         orderItem.name = chktItem.name
  //         orderItem.price = chktItem.price
  //         orderItem.quantity = chktItem.quantity
  //         orderItem.total = chktItem.total
  //         console.log("product => ", chktItem)
  //         orderItem.prod_id = (chktItem as any).product.prod_id as string
  //         orderItem.variant = chktItem.variant
  //         orderItem.vrnt_id = chktItem.vrnt_id
  //         orderItem.image = chktItem.image

  //         return orderItem
  //       })
  //       order.total = order.items.reduce((prev, curr) => curr.total + prev, 0)
  //       order.total_quantity = order.items.reduce((prev, curr) => curr.quantity + prev, 0)
  //       order.mcht_id = merchant.mcht_id
  //       order.mcht_name = merchant.name
  //       return order
  //     })
  //     const newOrders = await this.ordersRepository.createMany(session, ...orders)

  //     await this.checkoutsRepository.findOneAndDelete({ chkt_id: checkout.chkt_id }, session)

  //     const cart = await this.cartsRepository.findOne({ user_id: userId })

  //     await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items.filter(item => newCheckoutItem.find(chktItem => chktItem.item_id === item.item_id) ? false : true) }, session)
  //     if (createOrderDto.payment_method !== PaymentMethodFormat.WALLET) {
  //       const payment = await this.paymentsService.creditCard(userId, { amount_: checkout.total, token: createOrderDto.token })
  //       console.log(payment)
  //       await this.ordersRepository.update({ _id: { $in: newOrders.map(order => order._id) } }, { $set: { chrg_id: payment.id } }, session)
  //     }
  //     await session.commitTransaction();
  //     if (createOrderDto.payment_method === PaymentMethodFormat.WALLET) {
  //       const orders = await Promise.all(newOrders.map(async order => ({ orderId: order.order_id, total: order.total, wei: await this.getWei(order.total) })))
  //       return { data: orders }
  //     } else {
  //       return newOrders

  //     }
  //   } catch (error) {

  //     await session.abortTransaction();
  //     throw error;

  //   } finally {
  //     session.endSession()
  //   }
  // }
}
