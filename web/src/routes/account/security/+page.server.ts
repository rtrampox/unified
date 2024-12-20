import { revokeClient, type SessionResponse } from "@/api";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		session: locals.session.session as NonNullable<SessionResponse>,
	};
};
