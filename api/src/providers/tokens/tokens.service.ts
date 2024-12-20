import { Injectable } from "@nestjs/common";
import * as jose from "jose";
import { AccessTokenClaims, RefreshTokenClaims } from "src/providers/tokens/tokens.type";
import { DBService } from "../db/db.service";
import { Scopes } from "@prisma/client";

@Injectable()
export class RefreshTokenService {
	private JWT_SECRET = jose.base64url.decode(process.env.JWT_SECRET || "");

	constructor(private readonly db: DBService) {}

	async encrypt(claims: RefreshTokenClaims, expiry: string = "7d"): Promise<string> {
		const token = await new jose.EncryptJWT(claims)
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			// now in UNIX
			.setNotBefore("0s from now")
			.setIssuedAt()
			.setIssuer(process.env.JWT_ISSUER_URL ?? "")
			.setAudience(claims.aud)
			.setExpirationTime(expiry)
			.encrypt(this.JWT_SECRET);

		await this.db.refreshToken.create({
			data: {
				userId: claims.sub,
				clientId: claims.aud,
				scopes: claims.scope.split(" ") as Scopes[],
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
				token,
			},
		});

		return token;
	}

	async decrypt<T extends AccessTokenClaims | RefreshTokenClaims>(
		token: string,
	): Promise<jose.JWTDecryptResult<T> | false> {
		try {
			const jwt = await jose.jwtDecrypt<T>(token, this.JWT_SECRET, {
				issuer: process.env.JWT_ISSUER_URL,
			});

			return jwt;
		} catch {
			return false;
		}
	}
}

@Injectable()
export class AccessTokenService {
	private JWT_SECRET = jose.base64url.decode(process.env.JWT_SECRET || "");

	constructor(private readonly db: DBService, private readonly rfTokenSvc: RefreshTokenService) {}

	async encrypt(
		claims: AccessTokenClaims,
		expiry: string = "1h",
	): Promise<{ access_token: string; refresh_token: string | undefined }> {
		const token = await new jose.EncryptJWT(claims)
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			.setNotBefore("0s from now")
			.setIssuedAt()
			.setIssuer(process.env.JWT_ISSUER_URL ?? "")
			.setAudience(claims.aud)
			.setExpirationTime(expiry)
			.encrypt(this.JWT_SECRET);

		let refresh_token: string | undefined = undefined;

		if (claims.scope.includes("offline_access")) {
			refresh_token = await this.rfTokenSvc.encrypt(claims);
		}

		return { access_token: token, refresh_token };
	}

	async decrypt<T extends AccessTokenClaims | RefreshTokenClaims>(
		token: string,
	): Promise<jose.JWTDecryptResult<T> | false> {
		try {
			const jwt = await jose.jwtDecrypt<T>(token, this.JWT_SECRET, {
				issuer: process.env.JWT_ISSUER_URL,
			});

			return jwt;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
}
