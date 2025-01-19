import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";

export class Identity {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	// @IsStrongPassword()
	password: string;

	@IsBoolean()
	@IsOptional()
	@IsOptional()
	trust?: boolean;
}
