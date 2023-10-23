import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserAdvancedDto } from './dto/update-user-advanced.dto';
import { PermissionFormat, RoleFormat } from '@app/common/enums';
import { GetUserId, Permission, Public, Roles } from '@app/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CREATE_MERCHANT_EVENT, DELETE_MERCHANT_EVENT } from '@app/common/constants';
import { RmqService } from '@app/common';
import { CreateMerchantData, DeleteMerchantData } from '@app/common/interfaces';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailDto } from './dto/update-email.dtp';
import path from 'path';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { SendEmailResetDto } from './dto/send-email-reset-pass.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@ApiTags('User')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) { }

  @Patch()
  updatePrdfileUser(@GetUserId() userId: string,@Body() data: UpdateProfileDto) {
    return this.usersService.updateProfileByUser(userId, data)
  }

  @Post('email')
  sendChangeEmail(@GetUserId() userId: string, @Body() data: UpdateEmailDto) {
    return this.usersService.sendChangeEmail(userId, data)
  }

  @Public()
  @Get('email')
  changeEmail(@Query('token') token: string) {
    return this.usersService.changeEmailByUser(token)
  }

  @Patch('password')
  changePasswordNew(@GetUserId() userId: string, @Body() data: ChangePasswordUserDto) {
    return this.usersService.changePasswordUser(userId, data)
  }

  // * Reset Password
  @Public()
  @Post('password/reset')
  sendEmailResetPassword( @Body() data: SendEmailResetDto) {
    return this.usersService.sendEmailResetPass(data)
  }

  @Public()
  @Get('password/reset')
  checkTokeResetPass(@Query('token') token: string) {
    return this.usersService.checkTokenResetPassword(token)
  }

  @Public()
  @Patch('password/reset')
  resetPassword(@Query('token') token: string, @Body() data: ResetPasswordDto){
    return this.usersService.resetPasswordByUser(token, data);
  }

  // ! Admin

  @Roles(RoleFormat.ADMIN)
  @Get('admins')
  getAdmins(@Query('per_page') perPage: number, @Query('page') page: number) {
    return this.usersService.findAllAdmin(perPage, page);
  }

  @Roles(RoleFormat.ADMIN)
  @Get('admin/:id')
  getAdminById(@Param('id') id: string) {
    return this.usersService.findAdminById(id)
  }

  @Roles(RoleFormat.ADMIN)
  @Permission(PermissionFormat.UPDATE_ADMIN)
  @Patch('admin/:id')
  updateAdvanced(@GetUserId() user_current: string, @Param('id') id: string, @Body() updateUserDto: UpdateUserAdvancedDto) {
    return this.usersService.updateAdvanced(user_current, id, updateUserDto)
  }

  @Roles(RoleFormat.ADMIN)
  @Permission(PermissionFormat.DELETE_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.usersService.removeAdvanced(id);
  }

  @Roles(RoleFormat.ADMIN)
  @Permission(PermissionFormat.CREATE_ADMIN)
  @Post('admin')
  createAdmin(@Body() createAdmin: CreateAdminDto) {
    console.log(createAdmin)
    return this.usersService.createAdmin(createAdmin)
  }

  // ! Public 

  @Get("/me")
  me(@GetUserId() userId: string) {
    return this.usersService.me(userId);
  }


  @EventPattern(CREATE_MERCHANT_EVENT)
  async handleOrderCreated(@Payload() data : CreateMerchantData, @Ctx() context: RmqContext) {
    await this.usersService.putMerchantIdToUser(data)
    this.rmqService.ack(context);
  }

  @EventPattern(DELETE_MERCHANT_EVENT)
  async handlerMerchantDelete(@Payload() data: DeleteMerchantData, @Ctx() context: RmqContext){
    await this.usersService.deleteMerchantIdInUser(data)
    this.rmqService.ack(context)
  }

}
