import { Controller, Body, Post, Res, Get, Patch, Query, Param, Delete } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { GetUser, GetUserId, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
import { CredentialMerchantDto } from './dto/credential-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CHARGE_MONTH_EVENT } from '@app/common/constants/product.constant';
import { UpdateChargeMerchant } from '@app/common/interfaces/payment.event.interface';
import { log } from 'console';
import { RmqService } from '@app/common';
@ApiTags('Merchant')
@Controller('merchants')
export class MerchantsController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly merchantsService: MerchantsService
  ) { }
  @Roles(RoleFormat.USER)
  @Post("/start")
  create(@Res({ passthrough: true }) res, @GetUserId() userId: string, @GetUser('role') role: string, @GetUser('permission') permission: string[], @GetUser('merchant') merchant: string | undefined, @Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.createStarterMerchant(userId, role, merchant, permission, createMerchantDto, res);
  }
  @Roles(RoleFormat.MERCHANT)
  @Post("/credential")
  createCredential(@GetUser("merchant") merchantId: string, @Body() dto: CredentialMerchantDto) {
    return this.merchantsService.createCredential(merchantId, dto);
  }
  @Roles(RoleFormat.MERCHANT)
  @Get("/credential")
  getMerchantCredential(@GetUser("merchant") merchantId: string) {
    return this.merchantsService.getMerchantCredential(merchantId)
  }

  @Roles(RoleFormat.MERCHANT)
  @Patch("profile")
  updateMerchantProfile(@GetUser("merchant") merchantId: string, @Body() dto: UpdateMerchantDto) {
    return this.merchantsService.editMerchantProfile(merchantId, dto)
  }

  @Roles(RoleFormat.ADMIN)
  @Get()
  findAll(@Query('per_page') perPage: number, @Query('page') page: number) {
    return this.merchantsService.findAll(perPage, page);
  }

  // TODO: Get data Merchant จำนวนผู้ขายที่เปิดร้าน  ส่งคำร้อง และ แสดงยอดที่ผู้ขายสมัครเข้ามา
  @Roles(RoleFormat.ADMIN)
  @Get('dashboard')
  getDashboard() {
    return this.merchantsService.getDashboard()
  }

  @Get(':id')
  findMerchantById(@Param('id') id: string) {
    return this.merchantsService.findMerchantById(id)
  }

  @Roles(RoleFormat.ADMIN)
  @Patch(':id')
  updateMerchant(@Param('id') id: string, @Body() updateMerchant: UpdateMerchantDto) {
    return this.merchantsService.updateMerchantById(id, updateMerchant)
  }

  @Roles(RoleFormat.ADMIN)
  @Delete(':id')
  deleteMerchant(@Param('id') id: string) {
    return this.merchantsService.deleteMerchantById(id)
  }

  // * Merchant approves

  @Roles(RoleFormat.ADMIN)
  @Get('find/approvers')
  findAllApprovers(@Query('per_page') perPage: number, @Query('page') page: number) {
    console.log('test case')
    return this.merchantsService.findAllApproves(perPage, page)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }

  @Roles(RoleFormat.ADMIN)
  @Patch(':id/approves')
  updateApproves(@Param('id') id: string, @Body() updateMerchantDto: UpdateStatusDto) {
    return this.merchantsService.updateApproves(id, updateMerchantDto)
  }


  // Event micro
  @EventPattern(CHARGE_MONTH_EVENT)
  async handlerAmountUpdate(@Payload() data: UpdateChargeMerchant, @Ctx() context: RmqContext) {
    await this.merchantsService.updateChargeMerchantEvent(data)
    this.rmqService.ack(context)
  }


}
