import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

import { DBService } from "src/providers/db/db.service";
import { passwordService } from "src/providers/password";
import { Request, Response } from "express";
import { TrustedDevicesService } from "src/providers/trusted-devices/trusted-devices.service";
import { LoginUserDto } from "../dto/login/login-user.dto";
import { ContinueLoginDto } from "../dto/login/continue-login.dto";
import { Login } from "../entities/login/login.entity";
import { userLoginSelect } from "./login.constants";
import { MultifactorService } from "src/providers/multifactor/multifactor.service";
import { SessionService } from "src/providers/sessions/session.service";

@Injectable()
export class LoginService {
	constructor(
		private readonly db: DBService,
		private readonly sessions: SessionService,
		private readonly mfaService: MultifactorService,
		private readonly trustService: TrustedDevicesService,
	) {}

	async logout(req: Request, res: Response) {
		res = await this.sessions.finishSession(req, res);
		return res.status(200).send({ ok: true });
	}

	private async handleLogin(
		userId: string,
		req: Request,
		res: Response,
		options: {
			trust?: boolean;
			otpRequired?: boolean;
		} = {},
	) {
		const [session, sessionOk] = await this.sessions.create(userId, {
			ip: req.ip,
			userAgent: req.headers["user-agent"],
		});

		if (!sessionOk) {
			throw new InternalServerErrorException("Failed to create session");
		}

		if (options.trust) {
			const [device, deviceOk] = await this.trustService.create(userId, {
				ip: req.ip || "",
				userAgent: req.headers["user-agent"] || "",
			});

			if (!deviceOk) {
				throw new InternalServerErrorException("Failed to create trusted device");
			}

			res = this.trustService.writeCookie(device.id, res);
		}

		res = this.sessions.writeCookie(session, res);

		return res.send({
			user: { id: userId },
			otp: { required: options.otpRequired || false },
			session,
		} satisfies Login);
	}

	async create({ identity: { password, ...input } }: LoginUserDto, req: Request, res: Response) {
		const tdid = this.trustService.readCookie(req);
		const user = await this.db.user.findUnique({
			where: { email: input.email },
			select: userLoginSelect(tdid),
		});

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const valid = await passwordService.Compare(password, user.passwordHash);
		if (!valid) {
			throw new UnauthorizedException("Invalid credentials");
		}
		const isDeviceTrusted = !!(tdid && user.TrustedDevice.length && user.TrustedDevice[0].id === tdid);

		// Check for OTP requirement
		if (user.otp && !isDeviceTrusted) {
			return res.status(200).send({
				user: { id: user.id },
				otp: { required: true, type: user.otpType },
			});
		}
		return this.handleLogin(user.id, req, res, {
			trust: input.trust ? (isDeviceTrusted ? false : true) : false,
		});
	}

	async continue({ identity, otp }: ContinueLoginDto, req: Request, res: Response) {
		const user = await this.db.user.findFirst({
			where: { email: identity.email },
			select: userLoginSelect(),
		});

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const passValid = await passwordService.Compare(identity.password, user.passwordHash);
		if (!passValid) {
			throw new UnauthorizedException("Invalid credentials");
		}

		if (!user.otp) {
			throw new BadRequestException("MFA is not enabled for this user");
		}

		const valid = await this.mfaService.verify(user.otpSecret, otp.code);
		if (!valid) {
			throw new UnauthorizedException("Invalid OTP code");
		}

		return this.handleLogin(user.id, req, res, {
			trust: identity.trust,
			otpRequired: true,
		});
	}
}
