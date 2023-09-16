import { Body, Controller, Get, Logger, Param, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { PaymentMethodFormat, RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FINDONE_ORDER_EVENT, ORDERING_EVENT, ORDER_SERVICE, UPDATEREVIEW_ORDER_EVENT, UPDATE_ORDER_STATUS_EVENT } from '@app/common/constants/order.constant';
import { RmqService } from '@app/common';
import { FindOrderById, IUpdateOrderStatusEventPayload, OrderingEventPayload, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FullfillmentDto } from './dto/fullfuillment.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PaymentFormat } from './schemas/order.schema';



function ObservableArray(items) {
  var _self = this,
    _array = [],
    _handlers = {
      itemadded: [],
      itemremoved: [],
      itemset: []
    };

  function defineIndexProperty(index) {
    if (!(index in _self)) {
      Object.defineProperty(_self, index, {
        configurable: true,
        enumerable: true,
        get: function () {
          return _array[index];
        },
        set: function (v) {
          _array[index] = v;
          raiseEvent({
            type: "itemset",
            index: index,
            item: v
          });
        }
      });
    }
  }

  function raiseEvent(event) {
    _handlers[event.type].forEach(function (h) {
      h.call(_self, event);
    });
  }

  Object.defineProperty(_self, "addEventListener", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function (eventName, handler) {
      eventName = ("" + eventName).toLowerCase();
      if (!(eventName in _handlers)) throw new Error("Invalid event name.");
      if (typeof handler !== "function") throw new Error("Invalid handler.");
      _handlers[eventName].push(handler);
    }
  });

  Object.defineProperty(_self, "removeEventListener", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function (eventName, handler) {
      eventName = ("" + eventName).toLowerCase();
      if (!(eventName in _handlers)) throw new Error("Invalid event name.");
      if (typeof handler !== "function") throw new Error("Invalid handler.");
      var h = _handlers[eventName];
      var ln = h.length;
      while (--ln >= 0) {
        if (h[ln] === handler) {
          h.splice(ln, 1);
        }
      }
    }
  });

  Object.defineProperty(_self, "push", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      var index;
      for (var i = 0, ln = arguments.length; i < ln; i++) {
        index = _array.length;
        _array.push(arguments[i]);
        defineIndexProperty(index);
        raiseEvent({
          type: "itemadded",
          index: index,
          item: arguments[i]
        });
      }
      return _array.length;
    }
  });

  Object.defineProperty(_self, "pop", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      if (_array.length > -1) {
        var index = _array.length - 1,
          item = _array.pop();
        delete _self[index];
        raiseEvent({
          type: "itemremoved",
          index: index,
          item: item
        });
        return item;
      }
    }
  });

  Object.defineProperty(_self, "unshift", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      for (var i = 0, ln = arguments.length; i < ln; i++) {
        _array.splice(i, 0, arguments[i]);
        defineIndexProperty(_array.length - 1);
        raiseEvent({
          type: "itemadded",
          index: i,
          item: arguments[i]
        });
      }
      for (; i < _array.length; i++) {
        raiseEvent({
          type: "itemset",
          index: i,
          item: _array[i]
        });
      }
      return _array.length;
    }
  });

  Object.defineProperty(_self, "shift", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      if (_array.length > -1) {
        var item = _array.shift();
        delete _self[_array.length];
        raiseEvent({
          type: "itemremoved",
          index: 0,
          item: item
        });
        return item;
      }
    }
  });

  Object.defineProperty(_self, "splice", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function (index, howMany /*, element1, element2, ... */) {
      var removed = [],
        item,
        pos;

      index = index == null ? 0 : index < 0 ? _array.length + index : index;

      howMany = howMany == null ? _array.length - index : howMany > 0 ? howMany : 0;

      while (howMany--) {
        item = _array.splice(index, 1)[0];
        removed.push(item);
        delete _self[_array.length];
        raiseEvent({
          type: "itemremoved",
          index: index + removed.length - 1,
          item: item
        });
      }

      for (var i = 2, ln = arguments.length; i < ln; i++) {
        _array.splice(index, 0, arguments[i]);
        defineIndexProperty(_array.length - 1);
        raiseEvent({
          type: "itemadded",
          index: index,
          item: arguments[i]
        });
        index++;
      }

      return removed;
    }
  });

  Object.defineProperty(_self, "length", {
    configurable: false,
    enumerable: false,
    get: function () {
      return _array.length;
    },
    set: function (value) {
      var n = Number(value);
      var length = _array.length;
      if (n % 1 === 0 && n >= 0) {
        if (n < length) {
          _self.splice(n);
        } else if (n > length) {
          _self.push.apply(_self, new Array(n - length));
        }
      } else {
        throw new RangeError("Invalid array length");
      }
      _array.length = n;
      return value;
    }
  });

  Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
    if (!(name in _self)) {
      Object.defineProperty(_self, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Array.prototype[name]
      });
    }
  });

  if (items instanceof Array) {
    _self.push.apply(_self, items);
  }
}

ApiTags('Order')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {

  }

  private clients = new ObservableArray([])
 

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
    this.clients.map(client =>
      this.logger.warn("Clients array", client.userId, data.user_id)
    )
    const userClients = []
    for (let i = 0; i < this.clients.length; i++) {
      const element = this.clients[i];
      if (element.userId === data.user_id) {
        userClients.push({ res: element.res, userId: element.userId })
        this.clients.splice(i, 1)
        --i
      }
    }
    this.clients.push(...userClients);
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

  @Get("polling/orders")
  async getPollingOrder(@GetUserId() userId: string, @Res() res: Response,@Query() filter: OrderPaginationDto) {


    const data = await this.ordersService.myOrders(userId, filter);
    console.log(data)
    const isIncludeWalletPending = data.data.some(order => order.payment_method === PaymentMethodFormat.WALLET && order.payment_status === PaymentFormat.PENDING)
    if(isIncludeWalletPending){
      this.clients.push({ res, userId });
      this.clients.addEventListener("itemadded", async function (e) {
        if (e.item.res === res) {
          console.log("Added %s at index %d.", e.item.userId, e.index);
          res.json({refetch:userId === e.item.userId})
        }
      });
      res.on('close', () => {
        this.logger.warn("on close resposne")
        this.clients = this.clients.filter((client) => client.res !== res);
      });
    }else{
      res.json({refetch:false})
    }

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


  // // find order check comment in prodict
  // @Get('user/:productId')
  // myOrderValidity(@Param('productId') productId: string, @GetUserId() userId: string) {

  // }
}
