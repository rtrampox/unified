import { createZodDto } from "nestjs-zod";
import { basicClientSchema } from "src/clients/entities/client.entity";
import { z } from "zod";

const stringArr = () => z.array(z.string());

const authorizeGetSchema = z.object({
	user: z.object({ id: z.string(), login_hint: z.string(), isHinted: z.boolean() }),
	scopeDetails: z.object({
		requestedScopes: stringArr(),
		extraScopes: stringArr(),
		grantedScopes: stringArr(),
		scopesGranted: z.boolean(),
	}),
	client: basicClientSchema.extend({
		isAuthorized: z.boolean(),
	}),
});

const authorizePostSchema = z.object({
	client: z.object({ id: z.string() }),
	code: z.string(),
	redirect_uri: z.string(),
	state: z.string().optional(),
	id_token: z.string().optional(),
	mode: z.enum(["fragment", "query"]),
});

export class AuthorizeGetResponse extends createZodDto(authorizeGetSchema) {}
export class AuthorizePostResponse extends createZodDto(authorizePostSchema) {}
