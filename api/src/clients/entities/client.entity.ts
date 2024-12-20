import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const basicClientSchema = z.object({
	id: z.string(),
	name: z.string(),
	picture: z.string().url().optional(),
	enabled: z.boolean().optional().default(true),

	contactEmail: z.string().email(),
	privacyPolicyUrl: z.string().url().optional(),
	termsUrl: z.string().url().optional(),
});

const clientOkSchema = basicClientSchema.extend({
	user: z.object({
		id: z.string(),
	}),

	scopes: z.array(z.string()),
	redirectUri: z.array(z.string().url()),

	createdAt: z.string(),
	updatedAt: z.string(),
});

const clientOkSecretSchema = clientOkSchema.extend({
	secret: z.string(),
});

export class ClientOkResponseWithSecret extends createZodDto(clientOkSecretSchema.strict()) {}
export class ClientOkResponse extends createZodDto(clientOkSchema.strict()) {}
