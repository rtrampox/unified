import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClientRequest } from "./client.guard";
import { Client } from "@prisma/client";

export type ReqClient = Client;

export const UseClientGuard = createParamDecorator((_, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest<NonNullable<ClientRequest>>();

	if (!req.clientGuard) {
		throw new Error("ClientGuard must be used before UseClientGuard");
	}

	return req.clientGuard.client;
});
