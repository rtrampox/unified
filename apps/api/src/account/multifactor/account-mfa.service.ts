import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfirmTwoFactorDto } from "../dto/create-account.dto";
import { DBService } from "src/providers/db/db.service";
import { ReqSession } from "src/guards/auth/auth.decorator";
import { MultifactorService } from "src/providers/multifactor/multifactor.service";
import { userLoginSelect } from "src/identity/login/login.constants";

@Injectable()
export class AccountMFAService {
	constructor(private readonly db: DBService, private readonly mfa: MultifactorService) {}

	async enableTwoFactor(session: ReqSession) {
		if (session.user.otp) {
			throw new BadRequestException("Two-factor authentication is already enabled");
		}

		const { qrcode, url } = await this.mfa.initAppMFA(session.user.username, session.user.id);

		return {
			user: { id: session.user.id },
			enabled: false,
			message: "Confirmation required",
			qrcode,
			url,
		};
	}

	async confirmTwoFactor(body: ConfirmTwoFactorDto, session: ReqSession) {
		const user = await this.db.user.findUnique({ where: { id: session.user.id }, select: userLoginSelect() });
		if (!user) {
			throw new BadRequestException("User not found");
		}

		if (user.otp) {
			throw new BadRequestException("Two-factor authentication is already enabled");
		}

		const ok = await this.mfa.confirmAppMFA(user, body.code);
		if (ok) {
			return {
				user: { id: session.user.id },
				enabled: true,
			};
		}

		throw new BadRequestException("Invalid OTP code");
	}

	async disableTwoFactor(body: ConfirmTwoFactorDto, session: ReqSession) {
		const user = await this.db.user.findUnique({ where: { id: session.user.id }, select: userLoginSelect() });
		if (!user) {
			throw new BadRequestException("User not found");
		}

		if (!user.otp && !user.otpSecret) {
			throw new BadRequestException("Two-factor authentication is already disabled");
		}

		const ok = await this.mfa.disable(user, body.code);
		if (ok) {
			return {
				user: { id: session.user.id },
				enabled: false,
			};
		}

		throw new BadRequestException("Invalid OTP code");
	}
}
