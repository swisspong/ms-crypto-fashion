import { Body, Controller, Get, Logger, Param, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { PaymentMethodFormat, RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FINDONE_ORDER_EVENT, ORDERING_EVENT, ORDER_SERVICE, UPDATEREVIEW_ORDER_EVENT, UPDATE_ORDER_STATUS_EVENT, UPDATE_STATUS_REFUND_EVENT } from '@app/common/constants/order.constant';
import { RmqService } from '@app/common';
import { FindOrderById, IOrderStatusRefundEvent, IUpdateOrderStatusEventPayload, OrderingEventPayload, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FullfillmentDto } from './dto/fullfuillment.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RefundOrderDto } from './dto/refund-order.dto';
import { RECEIVED_ORDER_EVENT } from '@app/common/constants/payment.constant';
import { IReceivedOrder } from '@app/common/interfaces/payment.event.interface';
import { TxHashDto } from './dto/tx-hash.dto';




// function ObservableArray(items) {
//   var _self = this,
//     _array = [],
//     _handlers = {
//       itemadded: [],
//       itemremoved: [],
//       itemset: []
//     };

//   function defineIndexProperty(index) {
//     if (!(index in _self)) {
//       Object.defineProperty(_self, index, {
//         configurable: true,
//         enumerable: true,
//         get: function () {
//           return _array[index];
//         },
//         set: function (v) {
//           _array[index] = v;
//           raiseEvent({
//             type: "itemset",
//             index: index,
//             item: v
//           });
//         }
//       });
//     }
//   }

//   function raiseEvent(event) {
//     _handlers[event.type].forEach(function (h) {
//       h.call(_self, event);
//     });
//   }

//   Object.defineProperty(_self, "addEventListener", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function (eventName, handler) {
//       eventName = ("" + eventName).toLowerCase();
//       if (!(eventName in _handlers)) throw new Error("Invalid event name.");
//       if (typeof handler !== "function") throw new Error("Invalid handler.");
//       _handlers[eventName].push(handler);
//     }
//   });

//   Object.defineProperty(_self, "removeEventListener", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function (eventName, handler) {
//       eventName = ("" + eventName).toLowerCase();
//       if (!(eventName in _handlers)) throw new Error("Invalid event name.");
//       if (typeof handler !== "function") throw new Error("Invalid handler.");
//       var h = _handlers[eventName];
//       var ln = h.length;
//       while (--ln >= 0) {
//         if (h[ln] === handler) {
//           h.splice(ln, 1);
//         }
//       }
//     }
//   });

//   Object.defineProperty(_self, "push", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function () {
//       var index;
//       for (var i = 0, ln = arguments.length; i < ln; i++) {
//         index = _array.length;
//         _array.push(arguments[i]);
//         defineIndexProperty(index);
//         raiseEvent({
//           type: "itemadded",
//           index: index,
//           item: arguments[i]
//         });
//       }
//       return _array.length;
//     }
//   });

//   Object.defineProperty(_self, "pop", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function () {
//       if (_array.length > -1) {
//         var index = _array.length - 1,
//           item = _array.pop();
//         delete _self[index];
//         raiseEvent({
//           type: "itemremoved",
//           index: index,
//           item: item
//         });
//         return item;
//       }
//     }
//   });

//   Object.defineProperty(_self, "unshift", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function () {
//       for (var i = 0, ln = arguments.length; i < ln; i++) {
//         _array.splice(i, 0, arguments[i]);
//         defineIndexProperty(_array.length - 1);
//         raiseEvent({
//           type: "itemadded",
//           index: i,
//           item: arguments[i]
//         });
//       }
//       for (; i < _array.length; i++) {
//         raiseEvent({
//           type: "itemset",
//           index: i,
//           item: _array[i]
//         });
//       }
//       return _array.length;
//     }
//   });

//   Object.defineProperty(_self, "shift", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function () {
//       if (_array.length > -1) {
//         var item = _array.shift();
//         delete _self[_array.length];
//         raiseEvent({
//           type: "itemremoved",
//           index: 0,
//           item: item
//         });
//         return item;
//       }
//     }
//   });

//   Object.defineProperty(_self, "splice", {
//     configurable: false,
//     enumerable: false,
//     writable: false,
//     value: function (index, howMany /*, element1, element2, ... */) {
//       var removed = [],
//         item,
//         pos;

//       index = index == null ? 0 : index < 0 ? _array.length + index : index;

//       howMany = howMany == null ? _array.length - index : howMany > 0 ? howMany : 0;

//       while (howMany--) {
//         item = _array.splice(index, 1)[0];
//         removed.push(item);
//         delete _self[_array.length];
//         raiseEvent({
//           type: "itemremoved",
//           index: index + removed.length - 1,
//           item: item
//         });
//       }

//       for (var i = 2, ln = arguments.length; i < ln; i++) {
//         _array.splice(index, 0, arguments[i]);
//         defineIndexProperty(_array.length - 1);
//         raiseEvent({
//           type: "itemadded",
//           index: index,
//           item: arguments[i]
//         });
//         index++;
//       }

//       return removed;
//     }
//   });

//   Object.defineProperty(_self, "length", {
//     configurable: false,
//     enumerable: false,
//     get: function () {
//       return _array.length;
//     },
//     set: function (value) {
//       var n = Number(value);
//       var length = _array.length;
//       if (n % 1 === 0 && n >= 0) {
//         if (n < length) {
//           _self.splice(n);
//         } else if (n > length) {
//           _self.push.apply(_self, new Array(n - length));
//         }
//       } else {
//         throw new RangeError("Invalid array length");
//       }
//       _array.length = n;
//       return value;
//     }
//   });

//   Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
//     if (!(name in _self)) {
//       Object.defineProperty(_self, name, {
//         configurable: false,
//         enumerable: false,
//         writable: false,
//         value: Array.prototype[name]
//       });
//     }
//   });

//   if (items instanceof Array) {
//     _self.push.apply(_self, items);
//   }
// }

ApiTags('Order')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,

  ) {

    // this.clients = new ObservableArray([])
  }





  @EventPattern(UPDATEREVIEW_ORDER_EVENT)
  async handlerOrder(@Payload() data: UpdateStatusOrder, @Ctx() context: RmqContext) {
    this.logger.warn("Received from reviewed", data)
    await this.ordersService.updateReviewStatus(data)
    this.rmqService.ack(context);
  }
  @EventPattern(ORDERING_EVENT)
  async handlerOrdering(@Payload() data: OrderingEventPayload, @Ctx() context: RmqContext) {
    this.logger.warn("Received from checkout", data)
    await this.ordersService.ordering(data)
    this.rmqService.ack(context);
  }
  @EventPattern(UPDATE_ORDER_STATUS_EVENT)
  async updateStatus(@Payload() data: IUpdateOrderStatusEventPayload, @Ctx() context: RmqContext) {
    this.logger.warn("Received from Payment", data)
    await this.ordersService.updateStatus(data)

    this.rmqService.ack(context);
  }
  @EventPattern(UPDATE_STATUS_REFUND_EVENT)
  async updateStatusRefund(@Payload() data: IOrderStatusRefundEvent, @Ctx() context: RmqContext) {
    this.logger.warn("Received from Payment", data)
    await this.ordersService.updateStatusRefund(data)
    this.rmqService.ack(context);
  }
  // @Post()
  // create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.ordering(userId, createOrderDto);
  // }
  @Roles(RoleFormat.MERCHANT)
  @Post('merchant/cancel')
  merchantCancel(@GetUser("merchant") mchtId: string, @Body() cancelOrderDto: CancelOrderDto) {
    const { order_id } = cancelOrderDto
    return this.ordersService.cancelOrderByMerchant(mchtId, order_id);
  }

  @Post(':orderId/receive')
  receiveOrder(@Param("orderId") orderId: string, @GetUserId() userId: string) {
    return this.ordersService.receiveOrder(orderId, userId)
  }


  @Get("polling")
  getPollingOrders(@GetUserId() userId: string, @Res() res: Response, @Query() filter: OrderPaginationDto) {
    //return this.ordersService.ordersPolling(userId, res)
    return this.ordersService.ordersPollingNew(userId, undefined, res)
  }
  @Roles(RoleFormat.MERCHANT)
  @Get("merchant/polling")
  getPollingOrdersMerchant(@GetUser("merchant") mchtId: string, @Res() res: Response) {
    return this.ordersService.ordersPollingNew(undefined, mchtId, res)
  }


  @Get(":orderId/polling")
  getPollingOrder(@Param("orderId") orderId: string, @GetUserId() userId: string, @Res() res: Response, @Query() filter: OrderPaginationDto) {
    //return this.ordersService.ordersPolling(userId, res)
    return this.ordersService.orderPolling(orderId, userId, undefined, res)
  }
  @Roles(RoleFormat.MERCHANT)
  @Get(":orderId/merchant/polling")
  getPollingOrderMerchant(@Param("orderId") orderId: string, @GetUser("merchant") mchtId: string, @Res() res: Response) {
    return this.ordersService.orderPolling(orderId, undefined, mchtId, res)
  }

  @Get("checkout/:chktId")
  getOrderWalletByCheckout(@GetUserId() userId: string, @Param("chktId") chktId: string) {
    return this.ordersService.getOrderWalletByCheckoutId(userId, chktId)
  }
  @Post('cancel')
  customerCancel(@GetUserId() userId: string, @Body() cancelOrderDto: CancelOrderDto) {
    const { order_id } = cancelOrderDto
    return this.ordersService.cancelOrderByCustomer(userId, order_id);
  }

  @Roles(RoleFormat.MERCHANT)
  @Post("refund")
  merchantRefund(@GetUser("merchant") mchtId: string, @Body() refundDto: RefundOrderDto) {
    const { order_id } = refundDto
    return this.ordersService.merchantRefund(mchtId, order_id)
  }
  @Roles(RoleFormat.MERCHANT)
  @Get("merchant")
  allOrderByMerchant(@GetUser('merchant') merchantId: string, @Query() filter: OrderPaginationDto) {
    return this.ordersService.allOrderByMerchant(merchantId, filter);
  }
  @Get()
  myOrders(@GetUserId() userId: string, @Query() filter: OrderPaginationDto) {
    return this.ordersService.myOrders(userId, filter);
  }
  // @Roles(RoleFormat.MERCHANT)
  // @Get("merchant")
  // allOrderByMerchant(@GetUser('merchant') merchantId: string, @Query() filter: OrderPaginationDto) {
  //   return this.ordersService.allOrderByMerchant(merchantId, filter);
  // }

  // TODO: find data all overview of trading within
  @Roles(RoleFormat.ADMIN)
  @Get('dashboard/trade')
  allOrderTradeByMonth() {
    return this.ordersService.getOrderTradeByMonth()
  }
  @Roles(RoleFormat.MERCHANT)
  @Get('merchant/dashboard/trade')
  merchantOrderStatistic(@GetUser('merchant') mchtId: string) {
    return this.ordersService.merchantOrderTradeByMonth(mchtId)
  }

  // TODO: recent sales from merchant
  @Roles(RoleFormat.ADMIN)
  @Get('dashboard/sales')
  allOrderReacentSaleByMerchant(@Query('per_page') perPage: number, @Query('page') page: number) {
    return this.ordersService.getOrderRecentSaleByMerchant(perPage, page)
  }
  @Roles(RoleFormat.MERCHANT)
  @Post(":orderId/fullfillment")
  orderFullfillment(@Param("orderId") orderId: string, @GetUser('merchant') merchantId: string, @Body() dto: FullfillmentDto) {
    return this.ordersService.fullfillmentOrder(orderId, merchantId, dto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Get("merchant/:orderId")
  oneOrderByMerchant(@Param("orderId") orderId: string, @GetUser('merchant') merchantId: string,) {
    return this.ordersService.oneOrderByMerchant(orderId, merchantId);
  }
  @Get(":orderId")
  myOrderById(@Param("orderId") orderId: string, @GetUserId() userId: string) {
    return this.ordersService.myOrderById(orderId, userId);
  }

  @Post('txhash')
  orderTxHash(@GetUserId() userId: string, @Body() dto: TxHashDto) {
    return this.ordersService.orderSetTxHash(userId, dto)
  }


  // // find order check comment in prodict
  // @Get('user/:productId')
  // myOrderValidity(@Param('productId') productId: string, @GetUserId() userId: string) {

  // }
}
