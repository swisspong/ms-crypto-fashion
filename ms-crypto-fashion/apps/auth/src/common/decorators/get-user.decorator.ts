import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "../../interfaces/jwt-payload.interface"; 

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);