import type { SessionResponse } from "@/api";
import type { PageServerLoad } from "./$types";
import { logoutAction } from "@/server/logout";

export const load: PageServerLoad = async (event) => {
	const { isLoggedIn, session } = event.locals.session;

	return {
		isLoggedIn,
		session: session as SessionResponse,
		searchParams: event.url.searchParams.toString(),
	};
};

export const actions = {
	logout: logoutAction,
};
