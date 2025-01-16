import type { LayoutServerLoad } from "./$types";
import { requiresLogin } from "@/redirect";

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const user = locals.session;
	if (!user.isLoggedIn) {
		return requiresLogin(url);
	}

	return { url: url.pathname, user: user.session.user };
};
