import { Controller, Post, Body, UsePipes, Req, Res, Delete, HttpCode, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "@app/common/pipes/validation.pipe";

import { Request, Response } from "express";
import { LoginService } from "./login.service";
import { Public } from "src/guards/auth/auth.decorator";
import { Login } from "../entities/login/login.entity";
import { LoginUserDto } from "../dto/login/login-user.dto";
import { ContinueLoginDto } from "../dto/login/continue-login.dto";
import { CaptchaGuard } from "src/guards/captcha/captcha.guard";

/**
 * LoginController handles user login requests.
 */
@Public()
@ApiTags("Identity")
@Controller("identity")
@UsePipes(new ValidationPipe())
export class LoginController {
	constructor(private readonly service: LoginService) {}

	@Delete("logout")
	@Public()
	@HttpCode(200)
	@ApiOperation({ operationId: "logoutUser" })
	logout(@Req() req: Request, @Res() res: Response) {
		return this.service.logout(req, res);
	}

	/**
	 * Intializes user authentication, if 2FA is enabled, user will need to use the 'continue' process.
	 *
	 * @param LoginUserDto - Data transfer object containing user login details.
	 * @returns The user identity details.
	 */
	@Post("login")
	@UseGuards(CaptchaGuard)
	@ApiCreatedResponse({
		description: "The user has been successfully logged in.",
		type: Login,
	})
	@ApiOperation({ operationId: "loginUser" })
	login(@Body() input: LoginUserDto, @Req() req: Request, @Res() res: Response) {
		return this.service.login(input, req, res);
	}

	/**
	 * Continues login process when 2FA is enabled.
	 *
	 * @param LoginUserDto - Data transfer object containing user login details.
	 * @returns The user identity details.
	 */
	@ApiOperation({ operationId: "otpLoginUser" })
	@Post("login/continue")
	@ApiOkResponse({
		description: "The user has been successfully logged in.",
		type: Login,
	})
	continue(@Body() input: ContinueLoginDto, @Req() req: Request, @Res() res: Response) {
		return this.service.continue(input, req, res);
	}
}
