export const scopes = {
	openid: "View your unique identifier (Account ID).",
	profile: "View your name, username and profile picture.",
	email: "View your email.",
	address: "View your full address.",
	phone: "View your phone number.",
	offline_access: "Refresh your account information.",
	account: "Access your account information and change settings.",
};

export type Scopes = keyof typeof scopes;

function getScopes(scope: Scopes[]): string[] {
	const scopesArray: string[] = [];
	if (scope)
		scope.map((s) => {
			if (scopes[s]) scopesArray.push(scopes[s]);
		});
	return scopesArray;
}

export { getScopes };
