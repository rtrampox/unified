import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { authorizeSearchSchema } from "../dto/authorize.dto";

export const AuthorizeQuery = () => {
	const decorators: MethodDecorator[] = [];

	const notRequired = {
		code_challenge: true,
		code_challenge_method: true,
		state: true,
		nonce: true,
		login_hint: true,
	};

	for (const param of Object.keys(authorizeSearchSchema.shape)) {
		decorators.push(ApiQuery({ name: param, required: !notRequired[param] }));
	}

	return applyDecorators(...decorators);
};
