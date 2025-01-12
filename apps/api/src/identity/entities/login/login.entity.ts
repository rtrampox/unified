import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const schema = z.object({
	user: z.object({
		id: z.string(),
	}),
	otp: z.object({
		required: z.boolean(),
		type: z.string().optional(),
	}),
	session: z
		.object({
			id: z.string(),
			userId: z.string(),
			userAgent: z.string(),
			requestIp: z.string(),
			createdAt: z.date(),
			expiresAt: z.date(),
		})
		.optional(),
});

export class Login extends createZodDto(schema) {}
