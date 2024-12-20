import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as jose from "jose";
import { OpenidConfigurationResponseDto } from "./entities/openid-configuration.entity";
import { OIDC_KID } from "./oid.constants";

@Injectable()
export class OpenidConfigurationService {
	getOpenidConfiguration() {
		return {
			issuer: "https://localhost:3000",
			jwks_uri: "http://localhost:3000/.well-known/openid-configuration/jwks.json",
			authorization_endpoint: "http://localhost:3000/v1/oauth/authorize",
			token_endpoint: "http://localhost:3000/v1/oauth/token",
			userinfo_endpoint: "http://localhost:3000/v1/oauth/userinfo",
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
					...(await this.generateJwks("keys/public.pem", OIDC_KID)),
				},
			],
		};
	}

	private async generateJwks(publicKeyPath: string, kid: string): Promise<any> {
		// Read the public key
		const publicKeyPem = fs.readFileSync(publicKeyPath, "utf8");

		// Import the public key
		const publicKey = await jose.importSPKI(publicKeyPem, "RS256");

		const { ...rest } = await jose.exportJWK(publicKey);

		return {
			kid,
			use: "sig",
			alg: "RS256",
			...rest,
		};
	}
}
