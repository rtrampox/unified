import { Controller, Get } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ReqSession, Session } from "src/guards/auth/auth.decorator";
import { SessionResponse } from "../entities/session/sessionResponse";

@ApiTags("Identity")
@ApiCookieAuth("ssid")
@Controller("identity/session")
export class SessionController {
	constructor() {}

	@Get()
	@ApiOkResponse({
		description: "The record has been successfully created.",
		type: SessionResponse,
	})
	async getSession(@Session() session: ReqSession): Promise<SessionResponse> {
		return {
			user: session.user,
			...session.session,
		};
	}
}
