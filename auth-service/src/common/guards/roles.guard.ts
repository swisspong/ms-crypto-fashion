import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleFormat, User } from 'src/users/schemas/user.schema';
// import { RoleFormat, User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return this.isIncludeRole(roles, user.role)
    //matchRoles(roles, user.role);
  }

  isIncludeRole(roles: string[], role: string) {
    return roles.includes(role)
  }
}