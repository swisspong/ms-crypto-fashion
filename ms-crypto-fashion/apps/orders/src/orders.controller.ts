import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { PaymentMethodFormat, RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FINDONE_ORDER_EVENT, ORDERING_EVENT, ORDER_ERROR_EVENT, ORDER_SERVICE, UPDATEREVIEW_ORDER_EVENT, UPDATE_ORDER_STATUS_EVENT, UPDATE_STATUS_REFUND_EVENT } from '@app/common/constants/order.constant';
import { RmqService } from '@app/common';
import { FindOrderById, IOrderErrorEvent, IOrderStatusRefundEvent, IUpdateOrderStatusEventPayload, OrderingEventPayload, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FullfillmentDto } from './dto/fullfuillment.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RefundOrderDto } from './dto/refund-order.dto';
import { RECEIVED_ORDER_EVENT } from '@app/common/constants/payment.constant';
import { IReceivedOrder } from '@app/common/interfaces/payment.event.interface';
import { TxHashDto } from './dto/tx-hash.dto';
import { OrderIdsDto } from './dto/order-ids.dto';


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
  @EventPattern(ORDER_ERROR_EVENT)
  async handlerOrderError(@Payload() data: IOrderErrorEvent, @Ctx() context: RmqContext) {
    this.logger.warn("Received from payment", data)
    await this.ordersService.orderErrorHandler(data.orderIds)
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

  @Patch('txhash')
  orderTxHash(@GetUserId() userId: string, @Body() dto: TxHashDto) {
    return this.ordersService.orderSetTxHash(userId, dto)
  }
  @Post("error")
  orderWalletDelete(@GetUserId() userId: string, @Body() dto: OrderIdsDto) {
    return this.ordersService.deleteOrder(userId, dto.orderIds)
  }


  // // find order check comment in prodict
  // @Get('user/:productId')
  // myOrderValidity(@Param('productId') productId: string, @GetUserId() userId: string) {

  // }
}
