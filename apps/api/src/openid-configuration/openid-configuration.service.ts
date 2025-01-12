import { Injectable } from "@nestjs/common";
import * as jose from "jose";
import { OpenidConfigurationResponseDto } from "./entities/openid-configuration.entity";
import { OIDC_KID } from "./oid.constants";

@Injectable()
export class OpenidConfigurationService {
	getOpenidConfiguration() {
		const ISSUER_URL = process.env.JWT_ISSUER_URL ?? "https://localhost:3000";
		const API_PUBLIC_URL = process.env.API_PUBLIC_URL;

		return {
			issuer: ISSUER_URL ?? "https://localhost:3000",
			jwks_uri: `${ISSUER_URL}/.well-known/jwks.json`,
			authorization_endpoint: `${ISSUER_URL}/oauth/authorize`,
			token_endpoint: `${API_PUBLIC_URL}/v1/oauth/token`,
			userinfo_endpoint: `${API_PUBLIC_URL}/v1/oauth/userinfo`,
			scopes_supported: ["openid", "profile", "email", "phone", "offline_access"],
			response_types_supported: ["code", "id_token", "code id_token"],
			subject_types_supported: ["public"],
			id_token_signing_alg_values_supported: ["RS256"],
			authorization_signing_alg_values_supported: ["RS256"],
			token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
			claims_supported: [
				"iat",
				"iss",
				"sub",
				"aud",
				"nonce",
				"name",
				"given_name",
				"family_name",
				"preferred_username",
				"picture",
				"email",
				"email_verified",
				"phone",
				"phone_verified",
			],
			code_challenge_methods_supported: ["plain", "S256"],
			grant_types_supported: ["authorization_code", "refresh_token"],
			prompt_values_supported: ["none", "login", "consent"],
		} satisfies OpenidConfigurationResponseDto;
	}

	async getJwks() {
		return {
			keys: [
				{
					// Key used to sign ID and access tokens
					...(await this.generateJwks(OIDC_KID)),
				},
			],
		};
	}

	private async generateJwks(kid: string): Promise<any> {
		// Read the public key
		const publicKeyStr = process.env.JWT_PUBLIC_KEY as string;
		// Import the public key
		const publicKey = await jose.importSPKI(publicKeyStr, "RS256");

		const { ...rest } = await jose.exportJWK(publicKey);

		return {
			kid,
			use: "sig",
			alg: "RS256",
			...rest,
		};
	}
}
