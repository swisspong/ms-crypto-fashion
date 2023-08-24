import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserJwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>('permission', context.getHandler());
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwtPayload;
    return this.isIncludePermission(permissions, user.permission)
  }

  isIncludePermission(permissionsIn: string[], permissions: string[]) {
    const len = permissions.length

    if (len > 0) {
        const result = permissionsIn.every((val) => {
            const permission = permissions.includes(val)
            if (!permission) return permission

            return permission
        })
        return result
    }else {
        return false
    }
    
  }
}