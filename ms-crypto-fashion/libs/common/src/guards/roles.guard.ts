import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserJwtPayload } from '../interfaces/jwt.interface';
// import { RoleFormat, User } from '../../users/schema/user.schema';
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
    const user = request.user as UserJwtPayload;
    return this.isIncludeRole(roles, user.role)
    //matchRoles(roles, user.role);
  }

  isIncludeRole(roles: string[], role: string) {
    return roles.includes(role)
  }
}