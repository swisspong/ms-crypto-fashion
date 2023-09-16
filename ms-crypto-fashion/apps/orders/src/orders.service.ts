import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
// import axios from 'axios';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CheckoutItem, FindOrderById, IUpdateOrderStatusEventPayload, OrderingEventPayload, PaymentMethodFormat, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
import { Order, OrderItem, PaymentFormat, StatusFormat } from './schemas/order.schema';
import ShortUniqueId from 'short-unique-id';
import { PRODUCTS_ORDERING_EVENT, PRODUCTS_SERVICE } from '@app/common/constants/products.constant';
import { lastValueFrom } from 'rxjs';
import { CartsUtilService } from '@app/common/utils/carts/carts-util.service';
import { IProductOrderingEventPayload } from '@app/common/interfaces/products-event.interface';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';
import { CARTS_DELETE_ITEMS_EVENT, CARTS_SERVICE } from '@app/common/constants/carts.constant';
import { IDeleteChktEventPayload } from '@app/common/interfaces/carts.interface';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FullfillmentDto } from './dto/fullfuillment.dto';
import { IRefundWithCreditCardEventPayload } from '@app/common/interfaces/payment.event.interface';
import { PAYMENT_SERVICE, REFUND_CREDITCARD_EVENT } from '@app/common/constants/payment.constant';
import axios from 'axios';

@Injectable()
export class OrdersService {
  protected readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(CARTS_SERVICE) private readonly cartsClient: ClientProxy,
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentsClient: ClientProxy

  ) { }
  private uid = new ShortUniqueId()
  getHello(): string {
    return 'Hello World!';
  }

  // Event
  async getWei(priceTHB: number) {
    const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
    const rateInTHB = data.THB
    const rate = (1 * 10 ** 18) / rateInTHB
    const toWei = rate * priceTHB
    const rate2 = rateInTHB / (1 * 10 ** 18)
    const bath = toWei * rate2
    return { wei: Math.ceil(toWei), bath }
  }

  async findoneOrderById(data: FindOrderById) {
    try {
      const { order_id } = data
      const order = await this.ordersRepository.findOne({ order_id })
      this.logger.warn("find one to order =>", order)
      return order
    } catch (error) {
      throw error;
    }
  }
  async myOrders(userId: string, filter: OrderPaginationDto) {
    //const total = await this.ordersRepository.countDoc({ user_id: userId })
    const total = await this.ordersRepository.aggregate([
      {
        $match: {
          user_id: userId
        },
      },

      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const orders = await this.ordersRepository.aggregate([
      {
        $match: {
          user_id: userId
        },
      },

      { $sort: { createdAt: -1 } },
      {
        $skip: (filter.page - 1) * filter.per_page,
      },
      {
        $limit: filter.per_page
      },
    ])

    
    return {
      data: orders as Order[],
      page: filter.page,
      per_page: filter.per_page,
      total: total[0]?.count || 0,
      total_page: Math.ceil((total[0]?.count || 0) / filter.per_page)
    }
  }
  async updateReviewStatus(data: UpdateStatusOrder) {
    try {
      const { order_id, review } = data
      const status = await this.ordersRepository.findOneAndUpdate({ order_id }, { $set: { reviewStatus: review } })
      this.logger.warn("updated review status to order =>", status)
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
  async ordering(data: OrderingEventPayload) {

    const groupByMchtId = {}
    data.items.forEach(checkoutItem => {
      const proudct = checkoutItem.product
      const merchant = proudct.merchant
      groupByMchtId[merchant.mcht_id] = groupByMchtId[merchant.mcht_id] ?? []
      groupByMchtId[merchant.mcht_id].push(checkoutItem)
    })
    const groups = Object.entries<CheckoutItem[]>(groupByMchtId)



    const orders = await Promise.all(groups.map(async group => {
      const order = new Order()
      const product = (group[1][0]).product
      const merchant = product.merchant
      if (data.payment_method === PaymentMethodFormat.WALLET) {
        order.payment_status = PaymentFormat.PENDING
      }
      order.user_id = data.user_id
      order.order_id = `order_${this.uid.stamp(15)}`
      order.address = data.address
      order.post_code = data.post_code
      order.recipient = data.recipient
      order.tel_number = data.tel_number
      order.items = group[1].map(chktItem => {
        const orderItem = new OrderItem()
        orderItem.item_id = chktItem.item_id
        orderItem.name = chktItem.product.name
        orderItem.price = chktItem.price
        orderItem.quantity = chktItem.quantity
        orderItem.total = chktItem.total
        console.log("product => ", chktItem)
        orderItem.prod_id = (chktItem as any).product.prod_id as string
        orderItem.variant = chktItem.variant
        orderItem.vrnt_id = chktItem.vrnt_id
        orderItem.image = chktItem.image

        return orderItem
      })

      order.payment_status = PaymentFormat.PENDING
      order.total = order.items.reduce((prev, curr) => curr.total + prev, 0)
      order.total_quantity = order.items.reduce((prev, curr) => curr.quantity + prev, 0)
      order.mcht_id = merchant.mcht_id
      order.mcht_name = merchant.name
      order.payment_method = data.payment_method
      order.chkt_id = data.chkt_id
      if (data.payment_method === PaymentMethodFormat.WALLET) {
        order.wei = (await this.getWei(order.total)).wei
      }
      return order
    }))


    await this.ordersRepository.createMany(orders)
    // - event to product to cut stock
    //    - event to payment 
    //         - event to cart to remove item

    const payload: IProductOrderingEventPayload = {
      payment_method: data.payment_method,
      user_id: data.user_id,
      chkt_id: data.chkt_id,
      items: data.items,
      orders: orders.map(order => ({ orderId: order.order_id, total: order.total, mchtId: order.mcht_id })),
      token: data.token,
      total: orders.reduce((prev, curr) => prev + curr.total, 0)
    }
    this.logger.warn("Emit to product")
    await lastValueFrom(this.productsClient.emit(PRODUCTS_ORDERING_EVENT, { ...payload }))
    //return { message: "success" }

    // wait this.checkoutsRepository.findOneAndDelete({ chkt_id: checkout.chkt_id }, session)

    // const cart = await this.cartsRepository.findOne({ user_id: userId })

    // await this.cartsRepository.findOneAndUpdate({ cart_id: cart.cart_id }, { items: cart.items.filter(item => newCheckoutItem.find(chktItem => chktItem.item_id === item.item_id) ? false : true) }, session)
    // if (createOrderDto.payment_method !== PaymentMethodFormat.WALLET) {
    //   const payment = await this.paymentsService.creditCard(userId, { amount_: checkout.total, token: createOrderDto.token })
    //   console.log(payment)
    //   await this.ordersRepository.update({ _id: { $in: newOrders.map(order => order._id) } }, { $set: { chrg_id: payment.id } }, session)
    // }

    // if (createOrderDto.payment_method === PaymentMethodFormat.WALLET) {
    //   const orders = await Promise.all(newOrders.map(async order => ({ orderId: order.order_id, total: order.total, wei: await this.getWei(order.total) })))
    //   return { data: orders }
    // } else {
    //   return newOrders

    // }  
  }
  async updateStatus(data: IUpdateOrderStatusEventPayload) {
    await Promise.all(
      data.orderIds.map(async id => {
        await this.ordersRepository.findOneAndUpdate({ order_id: id }, { $set: { payment_status: PaymentFormat.PAID, chrg_id: data.chargeId } })
      })
    )
    const { chkt_id, user_id } = data
    if (chkt_id && user_id) {

      const payload: IDeleteChktEventPayload = {
        user_id,
        chkt_id
      }
      await lastValueFrom(
        this.cartsClient.emit(CARTS_DELETE_ITEMS_EVENT, payload)
      )
    }
  }
  // TODO: แสดงยอดขายและจำนวนรายการสั่งซื้ออต่ละเดือนปีปัจจุบัน
  async getOrderTradeByMonth() {
    try {
      const currentYear = new Date().getFullYear();

      const amountOrderMonth = await this.ordersRepository.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" }
            },
            totalSales: { $sum: "$total" },
            totalOrders: { $sum: 1 }
          }
        },
        {
          $sort: {
            "_id.month": 1
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            totalSales: 1,
            totalOrders: 1
          }
        }
      ])


      return amountOrderMonth
    } catch (error) {
      console.log(error)
    }
  }

  // TODO: แสดงยอดขายของแต่ละร้านค้า
  async getOrderRecentSaleByMerchant(per_page: number, page: number) {
    try {
      const skip = (Number(page) - 1) * Number(per_page)
      const limit = per_page
      const countMerchantOrders = await this.ordersRepository.aggregate([
        {
          $group: {
            _id: '$mcht_id',
            totalCount: { $sum: 1 } // Summing up the count of orders
          }
        },
        {
          $project: {
            totalCount: 1,
            _id: 0
          }
        },
      ]);

      const amountMerchant = await this.ordersRepository.aggregate([
        {
          $group: {
            _id: '$mcht_id',
            mcht_name: { $first: '$mcht_name' }, // เลือกค่า mcht_name ของรายการแรกในกลุ่ม
            totalAmount: { $sum: '$total' },
          }
        },
        {
          $project: {
            mcht_id: '$_id',
            mcht_name: 1,
            totalAmount: 1,
            _id: 0
          }
        },
        {
          $sort: {
            "mcht_id": 1
          }
        },
        {
          $skip: skip,
        },
        {
          $limit: limit
        }
      ])


      const total = countMerchantOrders.length
      
      return {
        page: Number(page),
        per_page: Number(per_page),
        total,
        total_page: Math.ceil(total / Number(per_page)),
        data: amountMerchant,
      };

    } catch (error) {
      console.log(error)
    }
  }
  async myOrderById(orderId: string, userId: string) {
    const order = await this.ordersRepository.findOne({ order_id: orderId, user_id: userId })
    return order
  }
  async allOrderByMerchant(merchantId: string, filter: OrderPaginationDto) {
    this.logger.warn("all")
    // const merchant = await this.merchantsRepository.findOne({ _id: new ObjectId(merchantId) })
    // const total = await this.ordersRepository.countDoc({ mcht_id: merchant.mcht_id })
    // const orders = await this.ordersRepository.find({ mcht_id: merchant.mcht_id }, undefined, (filter.page - 1) * filter.per_page, filter.per_page, { createdAt: "desc" })
    const total = await this.ordersRepository.aggregate([
      {
        $match: {
          mcht_id: merchantId
        },
      },

      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ])
    const orders = await this.ordersRepository.aggregate([
      {
        $match: {
          mcht_id: merchantId
        },
      },

      { $sort: { createdAt: -1 } },
      {
        $skip: (filter.page - 1) * filter.per_page,
      },
      {
        $limit: filter.per_page
      },
    ])
    return {
      data: orders,
      page: filter.page,
      per_page: filter.per_page,
      total: total[0]?.count || 0,
      total_page: Math.ceil((total[0]?.count || 0) / filter.per_page)
    }
  }
  async oneOrderByMerchant(orderId: string, merchantId: string) {

    const order = await this.ordersRepository.findOne({ order_id: orderId, mcht_id: merchantId })
    return order
  }

  async fullfillmentOrder(orderId: string, merchantId: string, dto: FullfillmentDto) {

    const order = await this.ordersRepository.findOne({ order_id: orderId, mcht_id: merchantId })
    if (order.status === StatusFormat.FULLFILLMENT) return order
    return await this.ordersRepository.findOneAndUpdate({ order_id: orderId, mcht_id: merchantId }, { status: StatusFormat.FULLFILLMENT, shipping_carier: dto.shipping_carier, tracking: dto.tracking, shipped_at: new Date() })
  }

  async cancelOrderByMerchant(mcht_id: string, orderId: string) {
    try {

      const order = await this.ordersRepository.findOne({ order_id: orderId, mcht_id: mcht_id })
      if (!order) throw new NotFoundException()
      if (order.payment_status !== PaymentFormat.PENDING && StatusFormat.FULLFILLMENT !== order.status && StatusFormat.CANCEL !== order.status) {
        if (order.payment_status !== PaymentFormat.REFUND) {
          const payload: IRefundWithCreditCardEventPayload = {
            amount: order.total * 100,
            chrgId: order.chrg_id
          }
          await lastValueFrom(this.paymentsClient.emit(REFUND_CREDITCARD_EVENT, payload))

          await this.ordersRepository.findOneAndUpdate({ _id: order._id }, { $set: { payment_status: PaymentFormat.REFUND } })
        }
        await this.ordersRepository.findOneAndUpdate({ _id: order._id }, { $set: { status: StatusFormat.CANCEL } })
      }
      return {
        message: "success"
      }
    } catch (error) {
      throw error
    }
  }
  async cancelOrderByCustomer(userId: string, orderId: string) {
    try {
      const order = await this.ordersRepository.findOne({ order_id: orderId, user_id: userId })
      if (!order) throw new NotFoundException()
      if (order.payment_status !== PaymentFormat.PENDING && StatusFormat.FULLFILLMENT !== order.status && StatusFormat.CANCEL !== order.status) {
        if (order.payment_status !== PaymentFormat.REFUND) {
          const payload: IRefundWithCreditCardEventPayload = {
            amount: order.total * 100,
            chrgId: order.chrg_id
          }
          await lastValueFrom(this.paymentsClient.emit(REFUND_CREDITCARD_EVENT, payload))
          await this.ordersRepository.findOneAndUpdate({ _id: order._id }, { $set: { payment_status: PaymentFormat.REFUND } })
        }
        await this.ordersRepository.findOneAndUpdate({ _id: order._id }, { $set: { status: StatusFormat.CANCEL } })
      }
      return {
        message: "success"
      }
    } catch (error) {
      throw error
    }
  }

  async getOrderWalletByCheckoutId(userId: string, chktId: string) {
    const orders = await this.ordersRepository.find({ chkt_id: chktId, user_id: userId, payment_status: PaymentFormat.PENDING })
    return {
      data: {
        userId,
        items: orders.map(order => ({ id: order.order_id, wei: order.wei, mchtId: order.mcht_id })),
        totalWei: orders.reduce((prev, curr) => prev + curr.wei, 0)
      }
    }
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
