import { Controller, Get, HttpCode, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { AuthorizeService } from "./authorize.service";
import { ReqSession, Session } from "src/guards/auth/auth.decorator";
import { ZodValidationPipe } from "nestjs-zod";
import { ApiResponse } from "@nestjs/swagger";
import { ApiErrorResponses } from "src/lib/apiError.decorator";
import { ClientGuard } from "src/guards/clients/client.guard";
import { ReqClient, UseClientGuard } from "src/guards/clients/client.decorator";
import { AuthorizeGetResponse, AuthorizePostResponse } from "../entities/authorize.entity";
import { AuthorizeSearchDto } from "../dto/authorize.dto";
import { AuthorizeQuery } from "./authorize.decorator";

@Controller("oauth/authorize")
@UseGuards(ClientGuard)
@UsePipes(ZodValidationPipe)
export class AuthorizeController {
	constructor(private readonly authorizeService: AuthorizeService) {}

	@Get()
	@ApiErrorResponses()
	@ApiResponse({ status: 200, type: AuthorizeGetResponse })
	@AuthorizeQuery()
	getAuthorizeInfo(
		@Query() queries: AuthorizeSearchDto,
		@Session() session: ReqSession,
		@UseClientGuard() client: ReqClient,
	) {
		return this.authorizeService.getInfo(queries, session, client);
	}

	@Post()
	@HttpCode(200)
	@AuthorizeQuery()
	@ApiErrorResponses()
	@ApiResponse({ status: 200, type: AuthorizePostResponse })
	authorize(@Query() queries: AuthorizeSearchDto, @Session() session: ReqSession, @UseClientGuard() client: ReqClient) {
		return this.authorizeService.authorize(queries, session, client);
	}
}
