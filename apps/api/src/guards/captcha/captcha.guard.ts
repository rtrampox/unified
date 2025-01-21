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

type GRecaptcha = {
	success: boolean; // whether this request was a valid reCAPTCHA token for your site
	score: number; // the score for this request (0.0 - 1.0)
	action: string; // the action name for this request (important to verify)
	challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
	hostname: string; // the hostname of the site where the reCAPTCHA was solved
	"error-codes": string[]; // optional
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

		let valid = false;

		if (req.body["captcha"]?.["type"] === "recaptcha") {
			valid = await this.ValidateGRecaptcha(token);
		} else if (req.body["captcha"]?.["type"] === "turnstile") {
			valid = await this.ValidateCFCaptcha(token);
		} else {
			return false;
		}

		req.captcha = { valid, token };

		if (!valid) {
			throw new UnauthorizedException("Invalid captcha token", {
				cause: "FROM_GUARD",
			});
		}

		return true;
	}

	private async ValidateCFCaptcha(token: string): Promise<boolean> {
		try {
			const formData = new FormData();

			formData.append("secret", process.env.CF_TURNSTILE_SECRET_KEY!);
			formData.append("response", token);

			const { data, status } = await axios.post<CFTurnstile>(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				formData,
			);

			this.logger.debug("Captcha validation response", data);
			if (status !== 200) {
				return false;
			}

			return data?.success;
		} catch (error) {
			this.logger.error("Failed to validate captcha token", error);
			return false;
		}
	}

	private async ValidateGRecaptcha(token: string): Promise<boolean> {
		try {
			const searchParams = new URLSearchParams();

			searchParams.append("secret", process.env.RECAPTCHA_SECRET_KEY!);
			searchParams.append("response", decodeURIComponent(token));

			const { data, status } = await axios.post<GRecaptcha>(
				`https://www.google.com/recaptcha/api/siteverify?${searchParams.toString()}`,
			);

			this.logger.debug("recaptcha validation response", data);
			if (status !== 200 || !data?.success) {
				return false;
			}

			return data?.score > 0.6;
		} catch (error) {
			this.logger.error("Failed to validate captcha token", error);
			return false;
		}
	}
}
