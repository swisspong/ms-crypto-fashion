import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Roles(RoleFormat.ADMIN)
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }


}
