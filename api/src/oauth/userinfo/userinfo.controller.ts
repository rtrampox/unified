import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { IUseAccessTokenGuard, UseAccessTokenGuard } from "src/guards/access-token/access-token.decorator";
import { AccessTokenGuard } from "src/guards/access-token/access-token.guard";
import { Public } from "src/guards/auth/auth.decorator";
import { UserInfoDto } from "./entities/userinfo.entitity";
import { ApiErrorResponses } from "src/lib/apiError.decorator";
import { UserinfoService } from "./userinfo.service";

@Controller("oauth/userinfo")
@Public()
@ApiBearerAuth()
export class UserinfoController {
	constructor(private readonly userinfoService: UserinfoService) {}

	@Get()
	@UseGuards(AccessTokenGuard)
	@ApiResponse({ status: 200, type: UserInfoDto })
	@ApiErrorResponses()
	async getUserInfo(@UseAccessTokenGuard() token: IUseAccessTokenGuard): Promise<UserInfoDto> {
		return this.userinfoService.getUserInfo(token);
	}
}
