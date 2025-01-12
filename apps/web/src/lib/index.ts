import type { RequestEvent, SubmitFunction } from "@sveltejs/kit";
import * as scp from "set-cookie-parser";
import { writable, type Writable } from "svelte/store";

// place files you want to import through the `$lib` alias in this folder.
export function resolveCookies(cookies: string | null, event: RequestEvent) {
	if (cookies) {
		for (const str of scp.splitCookiesString(cookies)) {
			const { name, value, sameSite, path, ...options } = scp.parseString(str);
			event.cookies.set(name, value, {
				path: path || "/",
				sameSite: sameSite as boolean | "strict" | "lax" | "none" | undefined,
				...options,
			});
		}
	}
}

export function resolveHeaders(headers: Headers, event: RequestEvent) {
	for (const [key, value] of headers) {
		if (key === "set-cookie") {
			resolveCookies(value, event);
			continue;
		}
		// event.setHeaders({ [key]: value });
	}
}

export const loadingStore = writable(false);

export const enhanceConfig = (loadingState: Writable<boolean>) => {
	const config: SubmitFunction = () => {
		loadingState.set(true);
		return async ({ update }) => {
			loadingState.set(false);
			update();
		};
	};

	return config;
};
