import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import axios from "axios";

export interface CaptchaRequest extends Request {
	captcha: {
		valid: boolean;
		token: string;
	};
}

type CFTurnstile = {
	success: boolean;
	challenge_ts: string;
	hostname: string;
	"error-codes": string[];
	action: string;
	cdata: string;
	metadata: Object;
};

@Injectable()
export class CaptchaGuard implements CanActivate {
	private readonly logger = new Logger(CaptchaGuard.name);

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<CaptchaRequest>();

		if (process.env.NODE_ENV !== "production" && req.headers["x-captcha-bypass"] === "true") {
			req.captcha = { valid: true, token: "bypass" };
			return true;
		}

		const token = req.headers["x-captcha-token"] || req.body["captcha"]?.["token"];
		if (!token) {
			throw new UnauthorizedException("Missing captcha token", {
				cause: "FROM_GUARD",
			});
		}

		// Validate the captcha token
		const valid = await this.ValidateCaptcha(token);

		req.captcha = { valid, token };

		if (!valid) {
			throw new UnauthorizedException("Invalid captcha token", {
				cause: "FROM_GUARD",
			});
		}

		return true;
	}

	private async ValidateCaptcha(token: string): Promise<boolean> {
		try {
			const formData = new FormData();

			formData.append("secret", process.env.CF_TURNSTILE_SECRET_KEY!);
			formData.append("response", token);

			const { data, status } = await axios.post<CFTurnstile>(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				formData,
			);

			if (status !== 200) {
				return false;
			}

			this.logger.debug("Captcha validation response", data, CaptchaGuard.name);

			return data?.success;
		} catch (error) {
			this.logger.error("Failed to validate captcha token", error.stack, CaptchaGuard.name);
			return false;
		}
	}
}
