import { Global, Module } from "@nestjs/common";
import { AccessTokenService, RefreshTokenService } from "./tokens.service";

@Global()
@Module({
	providers: [AccessTokenService, RefreshTokenService],
	exports: [AccessTokenService, RefreshTokenService],
})
export class TokensModule {}
