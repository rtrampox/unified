import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const schema = z.object({
	identity: z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.refine((value) => value),
		trust: z.boolean().optional().default(false),
	}),
});

export class LoginUserDto extends createZodDto(schema) {}
