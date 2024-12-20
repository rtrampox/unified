import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { redirect, type RequestEvent } from "@sveltejs/kit";

export function toCallback(url: URL) {
	const callback = url.searchParams.get("callback");

	if (!callback) return;

	const to = `/${callback.slice(1)}`;

	if (to.startsWith("http")) {
		throw new Error(`Invalid callback URL. External URLs are not allowed. To: ${to}`);
	}

	if (browser) {
		return goto(to, { replaceState: true });
	}

	return redirect(303, to);
}

/**
 * redirects the user to the login page with a callback query param
 * @param url - the current url
 */
export function requiresLogin(url: URL) {
	if (url.pathname.startsWith("/oauth/authorize")) {
		url.searchParams.set("prompt", "consent");
	}
	let search = resolvePrompt(url.search);
	const encoded = encodeURIComponent(`${url.pathname}${search}`);

	if (browser) {
		return goto(`/identity/login?callback=${encoded}`, { replaceState: true });
	}

	return redirect(303, `/identity/login?callback=${encoded}`);
}

/**
 * redirects the user to the logout page with a callback query param
 * @param url - the current url
 */
export function requestLogout(url: URL) {
	const search = url.search;

	const encoded = encodeURIComponent(`${url.pathname}${search}`);

	if (browser) {
		return goto(`/identity/logout?callback=${encoded}`, { replaceState: true });
	}

	return redirect(303, `/identity/logout?callback=${encoded}`);
}

export function requiresLoginFromCallback(callback: string) {
	callback = resolvePrompt(callback);

	const encoded = encodeURIComponent(callback);

	if (browser) {
		return goto(`/identity/login?callback=${encoded}`, { replaceState: true });
	}

	return redirect(303, `/identity/login?callback=${encoded ? encoded : "/identity/login"}`);
}

function resolvePrompt(search: string) {
	if (search?.includes("prompt=login")) {
		search = search.replace("&prompt=login", "");
		search = search.replace("?prompt=login", "");
		search = `${search}&prompt=consent`;
	}
	return search;
}
