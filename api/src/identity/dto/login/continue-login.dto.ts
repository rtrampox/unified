import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const schema = z.object({
	otp: z.object({
		code: z.string().min(6).max(6),
		type: z.string(),
	}),
	identity: z.object({
		email: z.string().email(),
		password: z.string().min(8),
		trust: z.boolean().optional().default(false),
	}),
});

export class ContinueLoginDto extends createZodDto(schema) {}
