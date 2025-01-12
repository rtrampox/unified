import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	sub: z.string(),
	preferred_username: z.string(),
	given_name: z.string(),
	family_name: z.string(),
	name: z.string(),
	email: z.string(),
	email_verified: z.boolean(),
	phone: z.string().nullable(),
	phone_verified: z.boolean(),
	locale: z.string(),
	picture: z.string().nullable(),
	updated_at: z.string(),
	scope: z.string(),
});

export class UserInfoDto extends createZodDto(schema.partial()) {}
