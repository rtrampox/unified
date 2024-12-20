import { Controller, Post, Body, UsePipes, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { RegisterService } from "./register.service";
import { ZodValidationPipe } from "nestjs-zod";
import { Request } from "express";
import { Public } from "src/guards/auth/auth.decorator";
import { Register } from "../entities/register/register.entity";
import { RegisterUserDto } from "../dto/register/register-user.dto";

/**
 * RegisterController handles user registration requests.
 */
@Public()
@ApiTags("Identity")
@Controller("identity/register")
export class RegisterController {
	constructor(private readonly service: RegisterService) {}

	/**
	 * Creates a new user record.
	 *
	 * @param createRegisterDto - Data transfer object containing user registration details.
	 * @returns The created user registration details.
	 */
	@Post()
	@UsePipes(ZodValidationPipe)
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: Register,
	})
	@ApiOperation({ operationId: "registerUser" })
	create(@Body() input: RegisterUserDto, @Req() req: Request): Promise<Register> {
		return this.service.create(input, req);
	}
}
