import { requiresLogin } from "$lib/redirect";
import { authorize, type AuthorizeParams } from "@/api";
import { redirect, type RequestEvent } from "@sveltejs/kit";

export async function authorizeClient(event: RequestEvent) {
	const params: { [key: string]: string } = {};
	for (const [key, value] of event.url.searchParams.entries()) {
		params[key] = value;
	}

	const { data, status } = await authorize({ ...(params as AuthorizeParams) });

	if (status === 401) {
		requiresLogin(event.url);
	}

	const uri = new URL(data.redirect_uri);
	uri.searchParams.append("code", data.code);
	if (data.id_token) {
		uri.searchParams.append("id_token", data.id_token);
	}
	if (data.state) {
		uri.searchParams.append("state", data.state);
	}
	uri.searchParams.append("scope", params.scope);

	return redirect(303, uri);
}
