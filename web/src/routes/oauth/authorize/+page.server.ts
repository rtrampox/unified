import { z } from "zod";
import type { PageServerLoad } from "./$types";
import {
	getAuthorizeInfo,
	type getAuthorizeInfoResponse,
	type HttpExceptionEntity,
	type SessionResponse,
} from "@/api";
import { fromError } from "zod-validation-error";
import { authorizeClient } from "@/server/authorize";
import { searchSchema } from "./schema";
import { requiresLogin } from "@/redirect";
import { isRedirect } from "@sveltejs/kit";

type Res =
	| { error: { name: string; message: string; requestId?: string }; data: null }
	| {
			error: null;
			user: getAuthorizeInfoResponse["data"]["user"];
			client: getAuthorizeInfoResponse["data"]["client"];
			scopeDetails: getAuthorizeInfoResponse["data"]["scopeDetails"];
			params: z.infer<typeof searchSchema>;
			session: SessionResponse | null;
	  };

export const load: PageServerLoad<Res | void> = async (event) => {
	try {
		const params: { [key: string]: string } = {};

		for (const [key, value] of event.url.searchParams.entries()) {
			params[key] = value;
		}

		const { data: parsed, error } = searchSchema.safeParse(params);
		if (error) {
			return {
				error: {
					name: "Validation Error",
					message: fromError(error).toString(),
				},
				data: null,
				params: parsed,
				session: event.locals.session.session,
			};
		}

		const { data, status } = await getAuthorizeInfo(parsed);
		if (status !== 200) {
			return {
				error: {
					name:
						(data as unknown as HttpExceptionEntity).error.message ??
						"Unexpected error while gathering data for this app",
					message:
						(data as unknown as HttpExceptionEntity).error.errors ??
						"Unexpected error while gathering data for this app",
					requestId: (data as unknown as HttpExceptionEntity).error.requestId,
				},
				data: null,
				params: parsed,
				session: event.locals.session.session,
			};
		}

		if (parsed.prompt === "login" || parsed.prompt === "select_account") {
			return await requiresLogin(event.url);
		}

		if (data.client.isAuthorized && parsed.prompt !== "consent") {
			return await authorizeClient(event);
		}

		return { error: null, ...data, params: parsed, session: event.locals.session.session };
	} catch (error) {
		if (isRedirect(error)) throw error;
		console.log(error);
		return {
			error: {
				message: "There was an unexpected error while processing your request",
				name: "Unexpected Error",
			},
			data: null,
			params: null,
			session: event.locals.session.session,
		};
	}
};

export const actions = {
	default: authorizeClient,
};
