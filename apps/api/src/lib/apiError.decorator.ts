import { ApiResponse } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpExceptionEntity } from "src/http-exception.filter";

// Create Error DTOs to define clear error structures
export class ErrorResponseDto {
	@ApiProperty({ example: "Error message description" })
	message: string;

	@ApiProperty({ example: "ERROR_CODE" })
	error: string;

	@ApiProperty({ example: 400 })
	statusCode: number;
}

export function ApiErrorResponses(
	customErrors: Array<{
		status: number;
		description: string;
		type?: any;
	}> = [],
) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const defaultErrors = [
			{
				status: HttpStatus.BAD_REQUEST,
				description: "Bad Request",
				type: HttpExceptionEntity,
			},
			{
				status: HttpStatus.UNAUTHORIZED,
				description: "Unauthorized",
				type: HttpExceptionEntity,
			},
			{
				status: HttpStatus.NOT_FOUND,
				description: "Not Found",
				type: HttpExceptionEntity,
			},
			{
				status: HttpStatus.CONFLICT,
				description: "Conflict",
				type: HttpExceptionEntity,
			},
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				description: "Internal Server Error",
				type: HttpExceptionEntity,
			},
		];
		[...defaultErrors, ...customErrors].forEach((error) => {
			ApiResponse({
				status: error.status,
				description: error.description,
				type: error.type || HttpExceptionEntity,
			})(target, propertyKey, descriptor);
		});

		return descriptor;
	};
}
