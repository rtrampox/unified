import { IsNotEmpty, IsObject, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Identity } from "./identity.dto";

class Otp {
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(6)
	code: string;

	@IsNotEmpty()
	type: string;
}

export class ContinueLoginDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Otp)
	otp: Otp;

	@IsObject()
	@ValidateNested()
	@Type(() => Identity)
	identity: Identity;
}
