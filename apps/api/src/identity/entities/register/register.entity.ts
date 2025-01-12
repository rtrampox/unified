import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const schema = z.object({
	user: z.object({
		id: z.string(),
		email: z.string(),
		username: z.string(),
	}),
	session: z.object({
		id: z.string(),
		userId: z.string(),
		userAgent: z.string(),
		requestIp: z.string(),
		createdAt: z.date(),
		expiresAt: z.date(),
	}),
});

export class Register extends createZodDto(schema) {}
