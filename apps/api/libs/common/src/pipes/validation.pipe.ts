import {
	ValidationPipe as NestValidationPipe,
	UnprocessableEntityException,
	ValidationPipeOptions,
} from "@nestjs/common";

export class ValidationPipe extends NestValidationPipe {
	constructor(options?: Partial<ValidationPipeOptions>) {
		super({
			whitelist: true,
			transform: true,
			exceptionFactory: (errors) => {
				console.log(errors[0].children);
				throw new UnprocessableEntityException({
					errors: this.flattenValidationErrors(errors).join(", "),
					message: "Validation failed",
				});
			},
			...options,
		});
	}
}
