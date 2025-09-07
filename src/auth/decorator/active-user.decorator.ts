import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { REQUEST_USER_KEY } from "../constants/auth.constants";

export const ActiveUser = createParamDecorator(
    (data: keyof ActiveUserData, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return data ? req[REQUEST_USER_KEY][data] : req[REQUEST_USER_KEY];
    }
)