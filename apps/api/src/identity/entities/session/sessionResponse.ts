import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	user: z.object({
		id: z.string(),
		email: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		username: z.string(),
		picture: z.string().nullable(),
		emailVerified: z.boolean(),
		otp: z.boolean(),
		otpType: z.string().nullable(),
	}),
	id: z.string(),
	userId: z.string(),
	userAgent: z.string(),
	requestIp: z.string(),
	createdAt: z.date(),
	expiresAt: z.date(),
});

export class SessionResponse extends createZodDto(schema) {}
