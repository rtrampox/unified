import { Controller, Body, Put, BadRequestException, UsePipes } from "@nestjs/common";
import { ConfirmTwoFactorDto } from "../dto/create-account.dto";
import { ApiResponse } from "@nestjs/swagger";
import {
	ConfirmTwoFactorResponse,
	DisableTwoFactorResponse,
	EnableTwoFactorResponse,
} from "../entities/account.entity";
import { ZodValidationPipe } from "nestjs-zod";
import { ReqSession, Session } from "src/guards/auth/auth.decorator";
import { AccountMFAService } from "./account-mfa.service";

/**
 * AccountController handles user account settings.
 */
@Controller("account")
export class AccountMFAController {
	constructor(private readonly accountMFAService: AccountMFAService) {}

	/**
	 * Intializes two-factor authentication for the user. Confirmation is required to fully enable mfa.
	 *
	 * @returns qr-code image, and URL for apps.
	 */
	@Put("mfa/enable")
	@ApiResponse({ status: 200, type: EnableTwoFactorResponse })
	@ApiResponse({ status: 400, type: BadRequestException })
	enableTwoFactor(@Session() session: ReqSession) {
		return this.accountMFAService.enableTwoFactor(session);
	}

	/**
	 * Confirms two-factor authentication for the user.
	 *
	 * @returns if it was enabled or not.
	 */
	@Put("mfa/enable/confirm")
	@ApiResponse({ status: 200, type: ConfirmTwoFactorResponse })
	@ApiResponse({ status: 400, type: BadRequestException })
	@UsePipes(ZodValidationPipe)
	confirmTwoFactor(@Body() body: ConfirmTwoFactorDto, @Session() session: ReqSession) {
		return this.accountMFAService.confirmTwoFactor(body, session);
	}

	@Put("mfa/disable")
	@ApiResponse({ status: 200, type: DisableTwoFactorResponse })
	@ApiResponse({ status: 400, type: BadRequestException })
	@UsePipes(ZodValidationPipe)
	disableTwoFactor(@Body() body: ConfirmTwoFactorDto, @Session() Session: ReqSession) {
		return this.accountMFAService.disableTwoFactor(body, Session);
	}
}
