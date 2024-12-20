import { BadRequestException, Injectable } from "@nestjs/common";
import { ReqSession } from "src/guards/auth/auth.decorator";
import { getExtras } from "src/lib/getExtras";
import { DBService } from "src/providers/db/db.service";
import { ReqClient } from "src/guards/clients/client.decorator";
import { AuthorizeSearchDto } from "../dto/authorize.dto";
import { JWTService } from "src/providers/jwt/jwt.service";
import { createHash } from "node:crypto";

@Injectable()
export class AuthorizeService {
	constructor(private readonly db: DBService, private readonly jwt: JWTService) {}

	generateCode() {
		const randomBytes = new Uint8Array(32);

		crypto.getRandomValues(randomBytes);

		return Buffer.from(String.fromCharCode.apply(null, randomBytes))
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");
	}

	hashCode(code: string) {
		const full = createHash("sha256").update(code).digest();
		const half = full.subarray(0, full.length / 2);

		return half.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}

	async authorize(queries: AuthorizeSearchDto, session: ReqSession, client: ReqClient) {
		const transaction = this.db.$transaction(async (tx) => {
			await tx.authorizedClient.upsert({
				where: { clientId_userId: { clientId: client.id, userId: session.user.id } },
				create: { clientId: client.id, userId: session.user.id, scopes: queries.scope },
				update: { scopes: queries.scope },
			});

			const code = this.generateCode();

			const codeHash = this.hashCode(code);

			const authorize = await tx.authorizationCode.create({
				data: {
					id: code,
					clientId: client.id,
					userId: session.user.id,
					scopes: queries.scope,
					responseType: queries.response_type,
					redirectUri: queries.redirect_uri,
					codeChallenge: queries.code_challenge,
					codeChallengeMethod: queries.code_challenge_method,
					nonce: queries.nonce,
					// expires in 10 minutes
					expiresAt: new Date(Date.now() + 1000 * 60 * 10),
				},
			});

			const user = await this.db.user.findUnique({ where: { id: session.user.id } });
			if (!user) throw new BadRequestException("Invalid user");

			const idToken = queries.response_type.includes("id_token");

			return {
				client: { id: client.id },
				code: authorize.id,
				redirect_uri: queries.redirect_uri,
				state: queries.state,
				id_token: idToken
					? await this.jwt.generateIdToken(queries.scope, user, client.id, { type: "/authorize", value: codeHash })
					: undefined,
				mode: idToken ? "fragment" : "query",
			};
		});

		return transaction;
	}

	async getInfo(queries: AuthorizeSearchDto, session: ReqSession, client: ReqClient) {
		const authorized = await this.db.authorizedClient.findUnique({
			where: { clientId_userId: { clientId: client.id, userId: session.user.id } },
		});

		const extraScopes = getExtras(queries.scope, authorized?.scopes ?? []);

		const response = {
			user: {
				id: session.user.id,
				login_hint: "",
				isHinted: true,
			},
			scopeDetails: {
				requestedScopes: queries.scope,
				extraScopes,
				grantedScopes: authorized?.scopes ?? [],
				scopesGranted: extraScopes.length === 0,
			},
			client: {
				...client,
				isAuthorized: authorized !== null,
				grantId: authorized?.id ?? null,
			},
		};

		if (queries.login_hint) {
			response.user.login_hint = queries.login_hint;
			response.user.isHinted = queries.login_hint === session.user.email;
		}

		return response;
	}
}
