import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	token_type: z.string(),
	expires_in: z.number(),
	access_token: z.string(),

	scope: z.string(),
	refresh_token: z.string().optional(),
	refresh_token_expires_in: z.number().optional(),

	id_token: z.string().optional(),
});

export class ExchangeTokenResponseDto extends createZodDto(schema) {}
