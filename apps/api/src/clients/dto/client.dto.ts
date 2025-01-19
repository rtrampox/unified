import { OmitType, PartialType } from "@nestjs/swagger";
import { Scopes } from "@prisma/client";
import { Transform, TransformFnParams } from "class-transformer";
import { z } from "zod";
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MinLength,
} from "class-validator";

export const scopesEnum = z.enum(["openid", "profile", "email", "offline_access"]);
export const responseTypeEnum = z.enum(["code", /* 'token', */ "id_token"]);

export class CreateClientDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsUrl()
	@IsOptional()
	picture?: string;

	@MinLength(1)
	@IsArray()
	@IsUrl({}, { each: true })
	redirectUri: string[];

	@MinLength(1)
	@IsArray()
	@IsString({ each: true })
	@IsEnum(Scopes, { each: true })
	@Transform(({ value }: TransformFnParams) => value.map((v) => v.toLowerCase()) as Scopes)
	scopes: Scopes[] = ["openid"];

	@IsNotEmpty()
	@IsEmail()
	contactEmail: string;

	@IsUrl()
	@IsOptional()
	privacyPolicyUrl?: string;

	@IsUrl()
	@IsOptional()
	termsUrl?: string;

	@IsOptional()
	@IsBoolean()
	enabled?: boolean = true;
}

export class UpdateClientDto extends PartialType(OmitType(CreateClientDto, ["enabled"])) {}
