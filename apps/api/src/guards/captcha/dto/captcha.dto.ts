import { IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { z } from "zod";

class Token {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	token: string;
}

export class CaptchaDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Token)
	captcha: Token;
}

export const CaptchaDtoSchema = z.object({
	captcha: z.object({
		token: z.string(),
	}),
});
