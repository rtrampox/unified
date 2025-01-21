import { config } from "$lib/config";
import { requiresLogin } from "$lib/redirect";
import { setEvent } from "@/api/custom-fetch";
import { useSession } from "@/server/session";
import type { HandleFetch, Handle } from "@sveltejs/kit";

const requiresAuth = ({ pathname }: URL): boolean => {
	const protectedUrls = ["/account", "/oauth/authorize"];
	return protectedUrls.some((protectedUrl) => pathname.startsWith(protectedUrl));
};

const isPublicUrl = ({ pathname }: URL): boolean => {
	// Cannot include "/" in the list of public URLs because it would make every request public.
	const publicUrls = ["/.well-known"];
	return publicUrls.some((publicUrl) => pathname.startsWith(publicUrl));
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const url = new URL(request.url);
	if (url.href.startsWith(config.apiUrl)) {
		const cookies = event.request.headers.get("cookie");
		if (cookies) {
			request.headers.set("cookie", cookies);
		}
	}

	return fetch(request);
};

export const handle: Handle = async ({ event, resolve }) => {
	setEvent(event);

	if (isPublicUrl(event.url)) {
		return resolve(event);
	}

	const { isLoggedIn, session, user } = await useSession(event.request.headers);

	if (requiresAuth(event.url) && !isLoggedIn) {
		throw requiresLogin(event.url);
	}

	if (isLoggedIn) {
		event.locals.session = {
			isLoggedIn,
			session,
			user,
		};
	} else {
		event.locals.session = {
			isLoggedIn,
			session: null,
			user: null,
		};
	}

	return resolve(event);
};
