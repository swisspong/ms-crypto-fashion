import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserJwtPayload } from "../interfaces/jwt.interface";

export const GetUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwtPayload;
    return user.sub;
  },
);