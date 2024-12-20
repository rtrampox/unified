import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsString } from "class-validator";
import { Request, Response } from "express";
import { ZodValidationException } from "nestjs-zod";
import { fromError } from "zod-validation-error";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		if (exception instanceof ZodValidationException) {
			const errors = exception.getZodError();
			const error = fromError(errors);

			return response.status(400).json({
				statusCode: 400,
				error: {
					message: "Validation failed",
					errors: error.toString(),
					timestamp: new Date().toISOString(),
					path: request.url,
				},
			});
		}

		response.status(status).json({
			statusCode: status,
			error: {
				message: exception.message,
				timestamp: new Date().toISOString(),
				path: request.url,
			},
		});
	}
}

class errorsObject {
	@ApiProperty()
	message: string;

	@ApiProperty()
	errors?: string;

	@ApiProperty()
	timestamp: string;

	@ApiProperty()
	path: string;
}

export class HttpExceptionEntity {
	@ApiProperty()
	statusCode: number;

	@ApiProperty({ type: errorsObject })
	@IsObject()
	error: errorsObject;
}
