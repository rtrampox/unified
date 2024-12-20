import { logoutUser } from "@/api";
import { requiresLoginFromCallback } from "@/redirect";
import type { RequestEvent } from "@sveltejs/kit";
import { resolveHeaders } from "..";

export async function logoutAction(event: RequestEvent) {
	const form = await event.request.formData();
	const callback = form.get("callback")?.toString();

	const { headers } = await logoutUser({ headers: event.request.headers });

	resolveHeaders(headers, event);

	return requiresLoginFromCallback(callback || "");
}
