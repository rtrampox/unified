import { Identity } from "./identity.dto";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CaptchaDto } from "src/guards/captcha/dto/captcha.dto";

export class LoginUserDto extends CaptchaDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Identity)
	identity: Identity;
}
