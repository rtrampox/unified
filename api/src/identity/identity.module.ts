import { Module } from "@nestjs/common";
import { RegisterService } from "./register/register.service";
import { LoginService } from "./login/login.service";
import { RegisterController } from "./register/register.controller";
import { LoginController } from "./login/login.controller";
import { SessionController } from "./session/session.controller";
import { MultifactorModule } from "src/providers/multifactor/multifactor.module";
import { SessionManagementModule } from "src/providers/sessions/session.module";

@Module({
	providers: [RegisterService, LoginService],
	controllers: [RegisterController, LoginController, SessionController],
	imports: [SessionManagementModule, MultifactorModule],
})
export class IdentityModule {}
