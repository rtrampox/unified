import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthorizationCode, Client, RefreshToken } from "@prisma/client";
import { Request } from "express";
import { ZodValidationException } from "nestjs-zod";
import { createHash } from "node:crypto";
import { tokenBodySchema } from "src/oauth/dto/token.dto";
import { DBService } from "src/providers/db/db.service";
import { passwordService } from "src/providers/password";
import { z } from "zod";

export interface IReqToken extends Request {
	token:
		| {
				params: z.infer<typeof tokenBodySchema>;
				client: Client;
				code: AuthorizationCode;
				method: "authorization_code";
		  }
		| {
				params: z.infer<typeof tokenBodySchema>;
				client: Client;
				code: RefreshToken;
				method: "refresh_token";
		  };
}

@Injectable()
export class TokenGuard implements CanActivate {
	constructor(private readonly db: DBService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<IReqToken>();

		const { params, ok, error } = this.parseParams(req);
		if (!ok) {
			throw new ZodValidationException(error);
		}

		const method = params.grant_type;

		if (method === "authorization_code") {
			const client = await this.validateClient(params.client_id);
			await this.validateClientSecret(params.client_secret, client.secretHash);
			const codeData = await this.validateAuthorizationCode(
				params.code as string,
				client.id,
				params.redirect_uri as string,
			);

			this.validateCodeVerifier(codeData.codeChallenge, params.code_verifier, codeData.codeChallengeMethod);

			req.token = {
				method,
				params,
				client,
				code: codeData,
			};

			return true;
		}

		if (method === "refresh_token") {
			const client = await this.validateClient(params.client_id);
			await this.validateClientSecret(params.client_secret, client.secretHash);
			const codeData = await this.validateRefreshToken(params.refresh_token as string, client.id);

			req.token = {
				method,
				params,
				client,
				code: codeData,
			};

			return true;
		}

		throw new BadRequestException("Invalid grant_type");
	}

	private async validateClient(clientId: string) {
		const client = await this.db.client.findUnique({ where: { id: clientId } });
		if (!client) {
			throw new BadRequestException("Invalid client id");
		}
		return client;
	}

	private async validateClientSecret(clientSecret: string | undefined, secretHash: string) {
		if (clientSecret) {
			const secretOk = await passwordService.Compare(clientSecret, secretHash);
			if (!secretOk) {
				throw new BadRequestException("Invalid client secret");
			}
		}
	}

	private async validateAuthorizationCode(code: string, clientId: string, redirectUri: string) {
		const codeData = await this.db.authorizationCode.findUnique({ where: { id: code } });
		if (!codeData) {
			throw new BadRequestException("Invalid code");
		}
		if (codeData.clientId !== clientId) {
			throw new BadRequestException("Client must be the same that initiated the flow");
		}
		if (codeData.redirectUri !== redirectUri) {
			throw new BadRequestException("redirect_uri must be the same that initiated the flow");
		}
		if (codeData.expiresAt < new Date()) {
			throw new BadRequestException("Code has expired");
		}
		return codeData;
	}

	private async validateRefreshToken(token: string, clientId: string) {
		const tokenData = await this.db.refreshToken.findUnique({ where: { token } });
		if (!tokenData) {
			throw new BadRequestException("Invalid refresh token");
		}

		if (tokenData.clientId !== clientId) {
			throw new BadRequestException("Client must be the same that initiated the flow");
		}

		return tokenData;
	}

	private validateCodeVerifier(
		challenge: string | null,
		verifier: string | undefined,
		method: "plain" | "S256" | null,
	) {
		if (challenge && !verifier) {
			throw new BadRequestException("code_verifier is required");
		}
		if (challenge && verifier) {
			const ok = this.validateCodeChallenge(challenge, verifier, method);
			if (!ok) {
				throw new BadRequestException("Invalid code_verifier");
			}
		}
	}

	parseParams(
		req: Request,
	):
		| { params: undefined; ok: false; error: z.ZodError }
		| { params: z.infer<typeof tokenBodySchema>; ok: true; error: null } {
		const { clientId, clientSecret } = this.parseAuthHeader(req);

		const params: z.infer<typeof tokenBodySchema> = {
			...req.body,
			client_secret: req.body.client_secret ?? clientSecret,
			client_id: req.body.client_id ?? clientId,
		};

		const { data, success, error } = tokenBodySchema.safeParse(params);
		if (!success) {
			return { params: undefined, ok: false, error };
		}

		return { params: data, ok: true, error: null };
	}

	parseAuthHeader(req: Request) {
		if (!req.headers.authorization) {
			return {};
		}

		const [type, token] = req.headers.authorization.split(" ") ?? [];
		if (type?.toLowerCase() !== "basic" || !token) {
			throw new BadRequestException("Invalid Authorization header");
		}
		const [clientId, clientSecret] = Buffer.from(token, "base64").toString().split(":");
		if (!clientId || !clientSecret) {
			throw new BadRequestException("Invalid Authorization header");
		}

		return { clientId, clientSecret };
	}

	validateCodeChallenge(chal: string, verifier: string, method: "plain" | "S256" | null = "S256") {
		if (method === "plain") {
			return chal === verifier;
		}

		const generated = createHash("sha256")
			.update(verifier)
			.digest("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=/g, "");

		return chal === generated;
	}
}
