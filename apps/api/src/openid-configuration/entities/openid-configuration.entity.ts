import { ApiProperty } from "@nestjs/swagger";

export class OpenidConfigurationResponseDto {
	@ApiProperty()
	issuer: string;

	@ApiProperty()
	jwks_uri: string;

	@ApiProperty()
	authorization_endpoint: string;

	@ApiProperty()
	token_endpoint: string;

	@ApiProperty()
	userinfo_endpoint: string;

	@ApiProperty()
	scopes_supported: string[];

	@ApiProperty()
	claims_supported: string[];

	@ApiProperty()
	grant_types_supported: string[];

	@ApiProperty()
	subject_types_supported: string[];

	@ApiProperty()
	response_types_supported: string[];

	@ApiProperty()
	code_challenge_methods_supported: string[];

	@ApiProperty()
	id_token_signing_alg_values_supported: string[];

	@ApiProperty()
	authorization_signing_alg_values_supported: string[];

	@ApiProperty()
	token_endpoint_auth_methods_supported: string[];

	@ApiProperty()
	prompt_values_supported: string[];
}
