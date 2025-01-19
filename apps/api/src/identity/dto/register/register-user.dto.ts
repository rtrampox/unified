import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Matches } from "class-validator";
import { CaptchaDto } from "src/guards/captcha/dto/captcha.dto";
import { OmitType, PartialType } from "@nestjs/swagger";

export class RegisterUserDto extends CaptchaDto {
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9\s]+$/, { message: "first name must contain only letters and numbers" })
	firstName: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9\s]+$/, { message: "last name must contain only letters and numbers" })
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	@IsPhoneNumber("BR")
	phone?: string;

	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+$/, { message: "username must contain only letters and numbers" })
	username: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}

export class UpdateUserDto extends PartialType(OmitType(RegisterUserDto, ["captcha", "password", "email"])) {}
