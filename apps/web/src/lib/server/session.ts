import { getSession, type SessionResponse } from "@/api";

export type Session =
	| {
			session: SessionResponse;
			isLoggedIn: true;
	  }
	| {
			isLoggedIn: false;
			session: null;
	  };

export async function useSession(headers: Headers) {
	const cookieH = headers.get("cookie") ?? "";

	const response = await getSession({
		headers: {
			cookie: cookieH,
		},
		credentials: "include",
	});

	const { data, status } = response;
	return {
		session: status === 200 ? (data as SessionResponse) : null,
		isLoggedIn: status === 200,
	};
}
