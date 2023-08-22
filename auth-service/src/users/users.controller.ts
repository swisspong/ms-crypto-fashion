import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserAdvancedDto } from './dto/update-user-advanced.dto';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleFormat } from './schemas/user.schema';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionFormat } from 'src/common/enums/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  updateAdvanced(@Param('id') id: string, @Body() updateUserDto: UpdateUserAdvancedDto) {
    return this.usersService.updateAdvanced(id, updateUserDto)
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



  
}
