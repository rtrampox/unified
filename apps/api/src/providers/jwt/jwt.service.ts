import { Injectable } from "@nestjs/common";
import { Scopes, User } from "@prisma/client";
import * as fs from "node:fs";
import * as path from "node:path";
import * as jose from "jose";
import { OIDC_KID } from "src/openid-configuration/oid.constants";
import { DBService } from "../db/db.service";

type UserClaims = {
	[key: string]: any;
} & {
	sub: string;
	aud: string;
	azp: string;
	nonce?: string;
	given_name?: string;
	family_name?: string;
	preffered_username?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	phone?: string | null;
	phone_verified?: boolean;
	picture?: string;
};

export type AccessTokenClaims = {
	[key: string]: any;
} & {
	iss: string;
	sub: string;
	aud: string;
	azp: string;
	scope: string;
	exp: number;
	iat: number;
};

type IdTokenModes =
	| {
			type: "/token";
			value: string;
	  }
	| {
			type: "/authorize";
			value: string;
	  };

@Injectable()
export class JWTService {
	private JWT_SECRET = jose.base64url.decode(process.env.JWT_SECRET || "");
	private privKeyStr = Buffer.from(process.env.JWT_PRIVATE_KEY as string, "base64url").toString("utf-8");
	private pubKeyStr = Buffer.from(process.env.JWT_PUBLIC_KEY as string, "base64url").toString("utf-8");
	private privateKey: jose.KeyLike;
	private publicKey: jose.KeyLike;

	constructor(private readonly db: DBService) {}

	private async initializeKeys() {
		this.privateKey = await jose.importPKCS8(this.privKeyStr, "RS256");
		this.publicKey = await jose.importSPKI(this.pubKeyStr, "RS256");
	}

	private claims: UserClaims = {
		sub: "",
		aud: "",
		azp: "",
	};

	private async ensureLoaded() {
		if (!this.privateKey || !this.publicKey) {
			return await this.initializeKeys();
		}
	}

	async generateRefreshToken(
		scopes: Scopes[],
		userId: string,
		clientId: string,
		update: boolean = false,
	): Promise<string> {
		const payload: AccessTokenClaims = {
			iss: process.env.JWT_ISSUER_URL ?? "",
			aud: clientId,
			azp: clientId,
			sub: userId,
			// 7 days
			exp: Math.floor(Date.now() / 1000) + 604800,
			iat: Math.floor(Date.now() / 1000),
			scope: scopes.join(" "),
		};

		const jwt = await new jose.EncryptJWT(payload)
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			.setIssuedAt()
			.setAudience(clientId)
			.setExpirationTime("7d")
			.encrypt(this.JWT_SECRET);

		if (update) {
			await this.db.refreshToken.upsert({
				where: { token: jwt },
				create: {
					token: jwt,
					userId,
					clientId,
					scopes,
					expiresAt: new Date(payload.exp * 1000),
				},
				update: {
					token: jwt,
					expiresAt: new Date(payload.exp * 1000),
				},
			});
		} else {
			await this.db.refreshToken.create({
				data: {
					token: jwt,
					userId,
					clientId,
					expiresAt: new Date(payload.exp * 1000),
				},
			});
		}

		return jwt;
	}

	async generateAccessToken(scopes: Scopes[], userId: string, clientId: string): Promise<string> {
		const payload: AccessTokenClaims = {
			iss: process.env.JWT_ISSUER_URL ?? "",
			aud: clientId,
			azp: clientId,
			sub: userId,
			exp: Math.floor(Date.now() / 1000) + 3600,
			iat: Math.floor(Date.now() / 1000),
			scope: scopes.join(" "),
		};

		const jwt = await new jose.EncryptJWT(payload)
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			.encrypt(this.JWT_SECRET);

		return jwt;
	}

	async generateIdToken(scopes: Scopes[], user: User, clientId: string, mode: IdTokenModes): Promise<string> {
		await this.ensureLoaded();

		const payload = {
			iss: process.env.JWT_ISSUER_URL ?? "",
			[mode.type === "/token" ? "at_hash" : "c_hash"]: mode.value,
			...this.parseScopes(scopes, user, clientId),
		};

		const jwt = await new jose.SignJWT(payload)
			.setProtectedHeader({
				kid: OIDC_KID,
				alg: "RS256",
			})
			.sign(this.privateKey);

		return jwt;
	}

	private parseScopes(scopes: Scopes[], user: User, clientId: string) {
		// Reset claims to base state
		this.claims = {
			sub: user.id,
			aud: clientId,
			azp: clientId,
		};

		for (const scope of scopes) {
			switch (scope) {
				case "openid":
					break;
				case "profile":
					this.claims.given_name = user.firstName;
					this.claims.family_name = user.lastName;
					this.claims.preffered_username = user.username;
					this.claims.name = `${user.firstName} ${user.lastName}`;
					this.claims.picture = user.picture ?? undefined;
					break;
				case "email":
					this.claims.email = user.email;
					this.claims.email_verified = user.emailVerified;
					break;
				case "phone":
					this.claims.phone = user.phone;
					this.claims.phone_verified = user.phoneVerified;
					break;
				case "offline_access":
					break;
				default:
					throw new Error(`Unknown scope: ${scope}`);
			}
		}

		// Add standard time-based claims
		this.claims.exp = Math.floor(Date.now() / 1000) + 3600;
		this.claims.iat = Math.floor(Date.now() / 1000);

		return this.claims;
	}

	async verifyAccessToken(token: string): Promise<jose.JWTVerifyResult<AccessTokenClaims> | false> {
		try {
			return await jose.jwtDecrypt(token, this.JWT_SECRET, {
				issuer: process.env.JWT_ISSUER_URL,
			});
		} catch {
			return false;
		}
	}

	async verifyRefreshToken(token: string): Promise<jose.JWTVerifyResult<AccessTokenClaims> | false> {
		try {
			return await jose.jwtDecrypt(token, this.JWT_SECRET, {
				issuer: process.env.JWT_ISSUER_URL,
			});
		} catch {
			return false;
		}
	}
}
