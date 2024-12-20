export type AccessTokenClaims = {
	iss: string;
	aud: string;
	azp: string;
	sub: string;
	scope: string;
};

export type RefreshTokenClaims = AccessTokenClaims;
