import { Identity } from "./identity.dto";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class LoginUserDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Identity)
	identity: Identity;
}
