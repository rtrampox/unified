import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export class CaptchaDto {
	@ApiProperty()
	captcha: {
		token: string;
	};
}

export const CaptchaDtoSchema = z.object({
	captcha: z.object({
		token: z.string(),
	}),
});
