import { Controller, HttpCode, Post, Put, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { IReqToken, TokenGuard } from "src/guards/token/token.guard";
import { IUseTokenGuard, UseTokenGuard } from "src/guards/token/token.decorator";
import { Public } from "src/guards/auth/auth.decorator";
import { ApiResponse } from "@nestjs/swagger";
import { ExchangeTokenResponseDto } from "../entities/token/token.entity";
import { ApiErrorResponses } from "src/lib/apiError.decorator";

@Controller("oauth/token")
@Public()
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@Post()
	@UseGuards(TokenGuard)
	@HttpCode(200)
	@ApiResponse({ status: 200, type: ExchangeTokenResponseDto })
	@ApiErrorResponses()
	exchangeToken(@UseTokenGuard() body: IUseTokenGuard) {
		return this.tokenService.exchangeToken(body);
	}

	@Put()
	@UseGuards(TokenGuard)
	@HttpCode(200)
	test(@UseTokenGuard() body: IUseTokenGuard) {
		return body;
	}
}
