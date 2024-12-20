import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { DBService } from "src/providers/db/db.service";
import { ZodValidationException } from "nestjs-zod";
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { authorizeSearchSchema } from "src/oauth/dto/authorize.dto";

export type ClientRequest = Request & {
	clientGuard?: {
		client: Prisma.ClientGetPayload<{ select: typeof clientSelect }>;
	};
};

const clientSelect = {
	id: true,
	name: true,
	picture: true,
	enabled: true,
	contactEmail: true,
	privacyPolicyUrl: true,
	termsUrl: true,
} satisfies Prisma.ClientSelect;

@Injectable()
export class ClientGuard implements CanActivate {
	constructor(private readonly db: DBService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<ClientRequest>();
		const { error, data } = authorizeSearchSchema.safeParse(req.query);
		if (error) {
			throw new ZodValidationException(error);
		}

		try {
			const client = await this.db.client.findFirst({
				where: { id: data.client_id },
				select: { ...clientSelect, scopes: true, redirectUri: true },
			});
			if (!client) {
				throw new BadRequestException(`Client with id ${data.client_id} was not found`);
			}

			if (!client.enabled) {
				throw new BadRequestException(`Client with id ${data.client_id} is disabled`);
			}

			const invalidScopes = data.scope.filter((scope) => !client.scopes.includes(scope));
			if (invalidScopes.length > 0) {
				throw new BadRequestException(
					`Scopes "${invalidScopes.join(", ")}" are not valid for client ${data.client_id}`,
				);
			}

			if (!client.redirectUri.includes(data.redirect_uri)) {
				throw new BadRequestException(`Invalid redirect_uri for client ${data.client_id}`);
			}

			const { scopes, redirectUri, ...rest } = client;

			req.clientGuard = { client: rest };

			return true;
		} catch (e) {
			if (e instanceof HttpException) throw e;
			console.error(e);
			throw new BadRequestException(e.message);
		}
	}
}
