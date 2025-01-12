import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { authGuardUserSelect, IAuthRequest } from "./auth.constants";
import { Session as ISession } from "@prisma/client";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export type ReqSession = {
	session: ISession;
	user: Prisma.UserGetPayload<{ select: typeof authGuardUserSelect }>;
};

export const Session = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<NonNullable<IAuthRequest>>();
	return request.auth;
});
