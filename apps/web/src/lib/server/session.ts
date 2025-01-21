import { getSession, type SessionResponse, type SessionResponseUser } from "@/api";

export type Session =
	| {
			session: SessionResponse;
			user: SessionResponseUser;
			isLoggedIn: true;
	  }
	| {
			isLoggedIn: false;
			user: null;
			session: null;
	  };

export async function useSession(headers: Headers): Promise<Session> {
	const cookieH = headers.get("cookie") ?? "";

	const response = await getSession({
		headers: {
			cookie: cookieH,
		},
		credentials: "include",
	});

	const { data, status } = response;

	return status === 200
		? {
				session: data as SessionResponse,
				user: data.user,
				isLoggedIn: true,
			}
		: {
				session: null,
				user: null,
				isLoggedIn: false,
			};
}
