import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CHECKOUT_EVENT, FINDONE_ORDER_EVENT, UPDATEREVIEW_ORDER_EVENT } from '@app/common/constants/order.constant';
import { RmqService } from '@app/common';
import { FindOrderById, UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {  }

  @Get()
  getHello(): string {
    return this.ordersService.getHello();
  }

  @MessagePattern(FINDONE_ORDER_EVENT)
  async handlerOrderFindone(@Payload() data: FindOrderById, @Ctx() context: RmqContext, ) {
    const order = this.ordersService.findoneOrderById(data)
    this.rmqService.ack(context);
    return order;
  }

  @MessagePattern(UPDATEREVIEW_ORDER_EVENT)
  async handlerOrder(@Payload() data: UpdateStatusOrder, context: RmqContext) {
    await this.ordersService.updateReviewStatus(data)
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
  // @Get()
  // myOrders(@GetUserId() userId: string, @Query() filter: OrderPaginationDto) {
  //   return this.ordersService.myOrders(userId, filter);
  // }
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

  // @Post(":orderId/fullfillment")
  // orderFullfillment(@Param("orderId") orderId: string, @GetUser('merchant') merchantId: string, @Body() dto: FullfillmentDto) {
  //   return this.ordersService.fullfillmentOrder(orderId, merchantId, dto);
  // }
  // @Roles(RoleFormat.MERCHANT)
  // @Get("merchant/:orderId")
  // oneOrderByMerchant(@Param("orderId") orderId: string, @GetUser('merchant') merchantId: string,) {
  //   return this.ordersService.oneOrderByMerchant(orderId, merchantId);
  // }
  // @Get(":orderId")
  // myOrderById(@Param("orderId") orderId: string, @GetUserId() userId: string) {
  //   return this.ordersService.myOrderById(orderId, userId);
  // }

  // // find order check comment in prodict
  // @Get('user/:productId')
  // myOrderValidity(@Param('productId') productId: string, @GetUserId() userId: string) {

  // }
}
