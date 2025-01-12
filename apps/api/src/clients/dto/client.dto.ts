import { Scopes } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const scopesEnum = z.enum(["openid", "profile", "email", "offline_access"]);
export const responseTypeEnum = z.enum(["code", /* 'token', */ "id_token"]);

const createSchema = z.object({
	name: z.string(),
	picture: z.string().url().optional(),

	redirectUri: z.array(z.string().url()),
	scopes: z.array(scopesEnum.transform((v) => v.toLowerCase() as Scopes)),

	contactEmail: z.string().email(),

	privacyPolicyUrl: z.string().url().optional(),
	termsUrl: z.string().url().optional(),

	enabled: z.boolean().optional().default(true),
});

export class CreateClientDto extends createZodDto(createSchema) {}

export class UpdateClientDto extends createZodDto(createSchema.omit({ enabled: true }).partial()) {}
