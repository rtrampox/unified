import { Scopes } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { responseTypeEnum, scopesEnum } from "src/clients/dto/client.dto";
import { z } from "zod";

const validateResponseType = (v: string) => v.split(" ").every((s) => responseTypeEnum.safeParse(s).success);

const validateScope = (v: string) => v.split(" ").every((s) => scopesEnum.safeParse(s).success);

const validateCodeChallengeMethod = (d: any) => !d.code_challenge || d.code_challenge_method;

const validateNonce = (d: any) => !(d.response_type.includes("id_token") && !d.nonce);

const validateOfflineAccess = (d: any) => !(d.scope.includes("offline_access") && d.code_challenge);

export const authorizeSearchSchema = z.object({
	client_id: z.string().cuid2(),
	redirect_uri: z.string().url(),

	code_challenge: z.string().optional(),
	code_challenge_method: z.enum(["plain", "S256"]).optional(),
	state: z.string().optional(),
	nonce: z.string().optional(),
	login_hint: z.string().optional(),

	response_type: z
		.string()
		.refine(validateResponseType, {
			message: "Response type must be a valid space-separated list of response types",
		})
		.transform((v) => v.toLowerCase().split(" ") as z.infer<typeof responseTypeEnum>[]),

	scope: z
		.string()
		.refine(validateScope, {
			message: "Scope must be a valid space-separated list of scopes",
		})
		.transform((v) => v.toLowerCase().split(" ") as Scopes[]),
});

export class AuthorizeSearchDto extends createZodDto(
	authorizeSearchSchema
		.refine(validateCodeChallengeMethod, {
			message: "method must be provided when code_challenge is provided",
		})
		.refine(validateNonce, {
			message: "nonce must be provided when id_token is requested",
		})
		.refine(validateOfflineAccess, {
			message: "offline_access and code_challenge are mutually exclusive",
		}),
) {}
