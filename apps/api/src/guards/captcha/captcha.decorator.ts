import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CaptchaRequest } from "./captcha.guard";

export type IUseCaptchaGuard = CaptchaRequest["captcha"];

export const UseCaptchaGuard = createParamDecorator((_, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest<CaptchaRequest>();

	if (req.captcha) {
		throw new Error("CaptchaGuard must be used before UseCaptchaGuard");
	}

	return req.captcha;
});
