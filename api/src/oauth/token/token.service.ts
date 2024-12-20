import { BadRequestException, Injectable } from "@nestjs/common";
import { ExchangeTokenResponseDto } from "../entities/token/token.entity";
import { JWTService } from "src/providers/jwt/jwt.service";
import { IUseTokenGuard } from "src/guards/token/token.decorator";
import { DBService } from "src/providers/db/db.service";
import { createHash } from "node:crypto";
import { AccessTokenService } from "src/providers/tokens/tokens.service";
import { AccessTokenClaims } from "src/providers/tokens/tokens.type";

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtSvc: JWTService,
		private readonly db: DBService,
		private readonly acTokenService: AccessTokenService,
	) {}

	hashAcToken(token: string) {
		const full = createHash("sha256").update(token).digest();
		const half = full.subarray(0, full.length / 2);

		return half.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}

	async exchangeToken(body: IUseTokenGuard): Promise<ExchangeTokenResponseDto> {
		const claims: AccessTokenClaims = {
			sub: body.code.userId,
			aud: body.code.clientId,
			azp: body.code.clientId,
			iss: process.env.JWT_ISSUER_URL ?? "",
			scope: body.code.scopes.join(" "),
		};

		const jwt = await this.acTokenService.encrypt(claims);

		const response: ExchangeTokenResponseDto = {
			access_token: jwt.access_token,
			expires_in: 3600,
			token_type: "Bearer",
			scope: body.code.scopes.join(" "),
			refresh_token: jwt.refresh_token,
		};

		if (body.code.scopes.includes("openid")) {
			const user = await this.db.user.findUnique({ where: { id: body.code.userId } });
			if (!user) throw new BadRequestException("Invalid user");

			response.id_token = await this.jwtSvc.generateIdToken(body.code.scopes, user, body.code.clientId, {
				type: "/token",
				value: this.hashAcToken(jwt.access_token),
			});
		}

		if (body.method === "authorization_code") {
			await this.db.authorizationCode.delete({
				where: { id: body.code.id },
			});
		}
		if (body.method === "refresh_token") {
			await this.db.refreshToken.delete({
				where: { token: body.params.refresh_token },
			});
		}

		return response;
	}
}
