import { config } from "$lib/config";
import { requiresLogin } from "$lib/redirect";
import { setEvent } from "@/api/custom-fetch";
import { useSession } from "@/server/session";
import type { HandleFetch, Handle } from "@sveltejs/kit";

const requiresAuth = ({ pathname }: URL, isLoggedIn: boolean): boolean => {
	const protectedUrls = ["/account", "/oauth/authorize"];
	return protectedUrls.some((protectedUrl) => pathname.startsWith(protectedUrl)) && !isLoggedIn;
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
	const { isLoggedIn, session } = await useSession(event.request.headers);

	if (requiresAuth(event.url, isLoggedIn)) {
		throw requiresLogin(event.url);
	}

	if (isLoggedIn && session) {
		event.locals.session = {
			isLoggedIn: true,
			session,
		};
	} else {
		event.locals.session = {
			isLoggedIn: false,
			session: null,
		};
	}

	return resolve(event);
};
