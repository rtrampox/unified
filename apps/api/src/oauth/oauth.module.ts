import { Module } from "@nestjs/common";
import { AuthorizeService } from "./authorize/authorize.service";
import { AuthorizeController } from "./authorize/authorize.controller";
import { JWTModule } from "src/providers/jwt/jwt.module";
import { TokenService } from "./token/token.service";
import { TokenController } from "./token/token.controller";
import { UserinfoService } from "./userinfo/userinfo.service";
import { UserinfoController } from "./userinfo/userinfo.controller";

@Module({
	controllers: [AuthorizeController, TokenController, UserinfoController],
	providers: [AuthorizeService, TokenService, UserinfoService],
	imports: [JWTModule],
})
export class OauthModule {}
