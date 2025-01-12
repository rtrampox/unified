import { z } from "zod";

export const searchSchema = z.object({
	client_id: z.string(),
	redirect_uri: z.string().url(),

	response_type: z.string(),
	scope: z.string(),

	code_challenge: z.string().optional(),
	code_challenge_method: z.enum(["plain", "S256"]).optional(),
	state: z.string().optional(),
	nonce: z.string().optional(),
	login_hint: z.string().optional(),
	prompt: z.enum(["none", "consent", "login", "select_account"]).optional(),
});
