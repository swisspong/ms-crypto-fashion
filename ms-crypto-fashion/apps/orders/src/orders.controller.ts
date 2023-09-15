import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FINDONE_ORDER_EVENT, ORDERING_EVENT, UPDATEREVIEW_ORDER_EVENT, UPDATE_ORDER_STATUS_EVENT } from '@app/common/constants/order.constant';
import { RmqService } from '@app/common';
import { FindOrderById, IUpdateOrderStatusEventPayload, OrderingEventPayload, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FullfillmentDto } from './dto/fullfuillment.dto';
ApiTags('Order')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name)
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) { }

  // @Get()
  // getHello(): string {
  //   return this.ordersService.getHello();
  // }

  // @EventPattern(FINDONE_ORDER_EVENT)
  // async handlerOrderFindone(@Payload() data: FindOrderById, @Ctx() context: RmqContext,) {
  //   const order = this.ordersService.findoneOrderById(data)
  //   this.rmqService.ack(context);
  //   return order;
  // }

  @EventPattern(UPDATEREVIEW_ORDER_EVENT)
  async handlerOrder(@Payload() data: UpdateStatusOrder,@Ctx() context: RmqContext) {
    this.logger.warn("Received from reviewed",data)
    await this.ordersService.updateReviewStatus(data)
    this.rmqService.ack(context);
  }
  @EventPattern(ORDERING_EVENT)
  async handlerOrdering(@Payload() data: OrderingEventPayload,@Ctx() context: RmqContext) {
    this.logger.warn("Received from checkout",data)
    await this.ordersService.ordering(data)
    this.rmqService.ack(context);
  }
  @EventPattern(UPDATE_ORDER_STATUS_EVENT)
  async updateStatus(@Payload() data: IUpdateOrderStatusEventPayload,@Ctx() context: RmqContext) {
    this.logger.warn("Received from Payment",data)
    await this.ordersService.updateStatus(data)
    this.rmqService.ack(context);
  }

  // @Post()
  // create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.ordering(userId, createOrderDto);
  // }
  // @Roles(RoleFormat.MERCHANT)
  // @Post('merchant/cancel')
  // merchantCancel(@GetUser("merchant") mchtId: string, @Body() cancelOrderDto: CancelOrderDto) {
  //   const { order_id } = cancelOrderDto
  //   return this.ordersService.cancelOrderByMerchant(mchtId, order_id);
  // }

  // @Post('cancel')
  // customerCancel(@GetUserId() userId: string, @Body() cancelOrderDto: CancelOrderDto) {
  //   const { order_id } = cancelOrderDto
  //   return this.ordersService.cancelOrderByCustomer(userId, order_id);
  // }
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
