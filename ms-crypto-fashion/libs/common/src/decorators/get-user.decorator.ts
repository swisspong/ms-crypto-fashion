import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserJwtPayload } from "../interfaces/jwt.interface";


export const GetUser = createParamDecorator(
  (data: keyof UserJwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data] as UserJwtPayload;
  },
);