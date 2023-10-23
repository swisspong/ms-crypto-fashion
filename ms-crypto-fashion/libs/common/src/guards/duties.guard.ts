import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserJwtPayload } from '../interfaces/jwt.interface';
// import { RoleFormat, User } from 'src/users/entities/user.entity';

@Injectable()
export class DutiesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const duties = this.reflector.get<string[]>('duties', context.getHandler());
    if (!duties) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwtPayload;
    return this.isIncludeRole(duties, user.role)
    //matchRoles(duties, user.role);
  }

  isIncludeRole(duties: string[], role: string) {
    return duties.includes(role)
  }
}