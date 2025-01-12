import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	trust: z.boolean().optional().default(false),
	callback: z.string().optional(),
	code: z.string(),
	"cf-turnstile-response": z.string(),
});
