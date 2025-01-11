import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { Request } from "express";
import * as jose from "jose";
import { AccessTokenService } from "src/providers/tokens/tokens.service";
import { AccessTokenClaims } from "src/providers/tokens/tokens.type";

export interface ATokenRequest extends Request {
	token: {
		token: string;
		claims: jose.JWTVerifyResult<AccessTokenClaims>;
	};
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
	constructor(private readonly tokenService: AccessTokenService) {}

	private error = new UnauthorizedException("Missing or invalid access token", {
		cause: "FROM_GUARD",
	});

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<ATokenRequest>();

		const [type, token] = req.headers.authorization?.split(" ") ?? [];
		if (type !== "Bearer" || !token) {
			throw this.error;
		}

		const claims = await this.tokenService.decrypt<AccessTokenClaims>(token);
		if (!claims) {
			throw this.error;
		}

		req.token = { token, claims };

		return true;
	}
}
