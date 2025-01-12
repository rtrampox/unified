import { Body, Controller, Delete, Get, Param, Put, UsePipes } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ReqSession, Session } from "src/guards/auth/auth.decorator";
import { ApiErrorResponses } from "src/lib/apiError.decorator";
import { UpdatePasswordDto } from "./dto/update-account.dto";
import { ZodValidationPipe } from "nestjs-zod";
import { ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { GetAppsResponseDto } from "./entities/apps.entity";
import { GetSignedUrlResponse } from "./entities/account.entity";

/**
 * AccountController handles user account settings.
 */
@Controller("account")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get("apps")
	@ApiResponse({ status: 200, type: GetAppsResponseDto })
	@ApiErrorResponses()
	@ApiOperation({ operationId: "getAuthorizedClients" })
	getAuthorizedClients(@Session() session: ReqSession) {
		return this.accountService.getAuthorizedClients(session);
	}

	@Delete("apps/:id/revoke")
	@ApiErrorResponses()
	revokeClient(@Param("id") id: string, @Session() session: ReqSession) {
		return this.accountService.revokeClient(id, session);
	}

	@Put("update-password")
	@ApiErrorResponses()
	@UsePipes(ZodValidationPipe)
	updatePassword(@Body() body: UpdatePasswordDto, @Session() session: ReqSession) {
		return this.accountService.updatePassword(body, session);
	}

	@Put("profile/picture/sign")
	@ApiOkResponse({ type: GetSignedUrlResponse })
	@ApiErrorResponses()
	getSignedProfilePictureUrl(@Session() session: ReqSession) {
		return this.accountService.getSignedProfilePictureUrl(session);
	}

	@Put("profile/picture/sign/complete")
	@ApiErrorResponses()
	completeProfilePictureUpload(@Session() session: ReqSession) {
		return this.accountService.completeProfilePictureUpload(session);
	}
}
