import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { MultifactorModule } from "src/providers/multifactor/multifactor.module";
import { AccountMFAController } from "./multifactor/account-mfa.controller";
import { AccountMFAService } from "./multifactor/account-mfa.service";

@Module({
	controllers: [AccountController, AccountMFAController],
	providers: [AccountService, AccountMFAService],
	imports: [MultifactorModule],
})
export class AccountModule {}
