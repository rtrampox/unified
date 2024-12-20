import { Module } from "@nestjs/common";
import { OpenidConfigurationService } from "./openid-configuration.service";
import { OpenidConfigurationController } from "./openid-configuration.controller";

@Module({
	controllers: [OpenidConfigurationController],
	providers: [OpenidConfigurationService],
})
export class OpenidConfigurationModule {}
