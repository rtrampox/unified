import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IReqToken } from "./token.guard";

export type IUseTokenGuard = IReqToken["token"];

export const UseTokenGuard = createParamDecorator((_, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest<IReqToken>();

	if (!req.token) {
		throw new Error("TokenGuard must be used before UseTokenGuard");
	}

	return req.token;
});
