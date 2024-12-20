import { Controller, Get } from "@nestjs/common";
import { OpenidConfigurationService } from "./openid-configuration.service";

import { Public } from "src/guards/auth/auth.decorator";
import { ApiResponse } from "@nestjs/swagger";
import { OpenidConfigurationResponseDto } from "./entities/openid-configuration.entity";
import { JwksResponseDto } from "./entities/jwks.entitties";

@Controller({
	path: ".well-known/openid-configuration",
	version: "",
})
@Public()
export class OpenidConfigurationController {
	constructor(private readonly openidConfigurationService: OpenidConfigurationService) {}

	@Get()
	@ApiResponse({ status: 200, type: OpenidConfigurationResponseDto })
	async getOpenidConfiguration() {
		return this.openidConfigurationService.getOpenidConfiguration();
	}

	@Get("jwks.json")
	@ApiResponse({ status: 200, type: JwksResponseDto })
	async getJwks() {
		return this.openidConfigurationService.getJwks();
	}
}
