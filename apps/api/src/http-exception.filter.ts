import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { Request, Response } from "express";
import { ZodValidationException } from "nestjs-zod";
import { fromError, ValidationError } from "zod-validation-error";
import * as Sentry from "@sentry/nestjs";
import { randomUUID } from "node:crypto";
import { exec } from "node:child_process";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		let requestId: string = randomUUID();

		const eventTimestamp = new Date().toISOString();

		if (status !== 404 && status !== 400 && status !== 422 && exception.cause !== "NO_SESSION") {
			requestId = Sentry.captureException(exception, {
				level: status >= 500 ? "error" : "warning",
				tags: {
					environment: process.env.NODE_ENV,
					priority: status >= 500 ? "high" : "medium",
				},
				extra: {
					status: status,
					url: request.url,
					method: request.method,
					timestamp: eventTimestamp,
					request: {
						headers: request.headers,
						body: request.body,
						query: request.query,
					},
				},
			});
		}

		this.logger.error(
			`HTTP Exception: ${exception.message}, requestId: ${requestId}`,
			status >= 500 ? exception.stack : undefined,
		);

		const responseBody: HttpExceptionEntity = {
			statusCode: status,
			error: {
				message: exception.message,
				timestamp: eventTimestamp,
				path: request.url,
				requestId: requestId,
				// @ts-expect-error exception does not have a response property
				errors: exception.getResponse()?.errors || exception.message,
			},
		};

		if (exception instanceof ZodValidationException) {
			const errors = exception.getZodError();
			const error = fromError(errors);

			responseBody.statusCode = 422;
			responseBody.error.errors = error.toString();
			responseBody.error.message = "Validation failed";
		}

		return response
			.setHeaders(
				new Headers({
					"X-Request-Id": requestId,
				}),
			)
			.status(status)
			.json(responseBody);
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

	@ApiProperty()
	requestId: string;

	constructor(data: Partial<errorsObject>) {
		Object.assign(this, data);
	}
}

export class HttpExceptionEntity {
	@ApiProperty()
	statusCode: number;

	@ApiProperty({ type: errorsObject })
	@IsObject()
	error: errorsObject;

	constructor(statusCode: number, error: Partial<errorsObject>) {
		this.statusCode = statusCode;
		this.error = new errorsObject(error);
	}
}
