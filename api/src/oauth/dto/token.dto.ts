import { z } from "zod";

const requireField = (field: string, message: string) => (data: any, ctx: any) => {
	if (!data[field]) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message,
			path: [field],
		});
	}
};

export const tokenBodySchema = z
	.object({
		client_id: z.string(),
		client_secret: z.string().optional(),
		redirect_uri: z.string().url().optional(),
		grant_type: z.enum(["authorization_code", "refresh_token"]),
		code: z.string().optional(),
		code_verifier: z.string().optional(),
		refresh_token: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.grant_type === "authorization_code") {
			requireField("code", "Code is required for authorization_code grant type")(data, ctx);
		}

		if (data.grant_type === "refresh_token") {
			requireField("refresh_token", "Refresh token is required for refresh_token grant type")(data, ctx);
			requireField("client_secret", "Client secret is required for refresh_token grant type")(data, ctx);
		}
	});
