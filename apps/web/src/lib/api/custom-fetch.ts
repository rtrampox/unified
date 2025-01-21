import { browser } from "$app/environment";
import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { toast } from "svelte-sonner";
import type { HttpExceptionEntity } from ".";

// NOTE: Supports cases where `content-type` is other than `json`
const getBody = <T>(c: Response | Request): Promise<T> => {
	const contentType = c.headers.get("content-type");

	if (contentType && contentType.includes("application/json")) {
		return c.json();
	}

	if (contentType && contentType.includes("application/pdf")) {
		return c.blob() as Promise<T>;
	}

	return c.text() as Promise<T>;
};

// NOTE: Update just base url
const getUrl = (contextUrl: string): URL => {
	const url = new URL(contextUrl);

	const backendUrl = new URL(env.BACKEND_URL);

	url.protocol = backendUrl.protocol;
	url.host = backendUrl.host;
	url.port = backendUrl.port;

	return url;
};

// NOTE: Add headers
const getHeaders = (headers?: HeadersInit): HeadersInit => {
	const newH = new Headers(headers);

	if (!browser) {
		newH.set("User-Agent", "sveltejs/kit; server-to-server");
	}

	return newH;
};

let event: RequestEvent | null = null;

export const setEvent = (Event: RequestEvent) => {
	event = Event;
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
	const requestUrl = getUrl(url);
	const requestHeaders = getHeaders(options.headers);

	const requestInit: RequestInit = {
		...options,
		headers: requestHeaders,
	};

	let FETCH = fetch;
	if (!browser && event) {
		FETCH = event.fetch;
	}

	const request = new Request(requestUrl, requestInit);

	const response = await FETCH(request);
	const data = await getBody<T>(response);

	const status = response.status;
	const headers = response.headers;

	if (browser && status >= 400) {
		toast.error((data as HttpExceptionEntity).error.message);
	}

	return { status, data, headers } as T;
};
