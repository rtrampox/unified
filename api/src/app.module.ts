import { Module } from "@nestjs/common";
import { DBService } from "./providers/db/db.service";
import { DbModule } from "./providers/db/db.module";
import { IdentityModule } from "./identity/identity.module";
import { TrustedDevicesModule } from "./providers/trusted-devices/trusted-devices.module";
import { AccountModule } from "./account/account.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule } from "./clients/clients.module";
import { ZodSerializerInterceptor } from "nestjs-zod";
import { OauthModule } from "./oauth/oauth.module";
import { OpenidConfigurationModule } from "./openid-configuration/openid-configuration.module";
import { AuthGuard } from "./guards/auth/auth.guard";
import { SessionManagementModule } from "./providers/sessions/session.module";
import { JWTModule } from "./providers/jwt/jwt.module";
import { TokensModule } from "./providers/tokens/tokens.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		IdentityModule,
		DbModule,
		SessionManagementModule,
		TrustedDevicesModule,
		AccountModule,
		ClientsModule,
		OauthModule,
		OpenidConfigurationModule,
		JWTModule,
		TokensModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	providers: [
		DBService,
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
	],
})
export class AppModule {}
