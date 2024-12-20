import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ATokenRequest } from "./access-token.guard";

export type IUseAccessTokenGuard = ATokenRequest["token"];

export const UseAccessTokenGuard = createParamDecorator((_, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest<NonNullable<IUseAccessTokenGuard>>();

	if (!req.token) {
		throw new Error("ClientGuard must be used before UseClientGuard");
	}

	return req.token;
});
