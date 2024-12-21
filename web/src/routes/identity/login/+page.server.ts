import type { PageServerLoad, Actions } from "./$types";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import {
	getLoginUserUrl,
	loginUser,
	otpLoginUser,
	type HttpExceptionEntity,
	type loginUserResponse,
} from "@/api";
import { resolveHeaders } from "@/index";

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(loginSchema));

	const { isLoggedIn, session } = event.locals.session;
	return {
		isLoggedIn,
		session,
		form,
		searchParams: event.url.searchParams.toString(),
	};
};

export const actions: Actions = {
	async login(event) {
		const form = await superValidate(event.request, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form, message: "Invalid form", otp: false });
		}

		const { data, status, headers } = await loginUser({
			identity: { email: form.data.email, password: form.data.password, trust: form.data.trust },
		});

		if (status !== 201 && status !== 200) {
			return fail(400, {
				form,
				message:
					(data as unknown as HttpExceptionEntity).error.message ??
					"Unexpected error while logging you in",
				otp: false,
			});
		}

		if (data.otp?.required) {
			return fail(400, { form, message: "MFA is enabled", otp: true });
		}

		resolveHeaders(headers, event);

		const callback = form.data.callback;

		return redirect(303, callback ? `/${callback.slice(1)}` : "/account");
	},

	async loginOtp(event) {
		const form = await superValidate(event.request, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form, message: "Invalid input", otp: true });
		}

		if (!form.data.code || form.data.code.length !== 6) {
			return fail(400, { form, message: "Invalid input", otp: true });
		}

		const { data, status, headers } = await otpLoginUser(
			{
				identity: { email: form.data.email, password: form.data.password, trust: form.data.trust },
				otp: { code: form.data.code, type: "APP" },
			},
			{ headers: event.request.headers },
		);

		if (status !== 201 && status !== 200) {
			// @ts-expect-error
			return fail(400, { form, message: data.message, otp: true });
		}

		resolveHeaders(headers, event);

		const callback = form.data.callback;

		return redirect(303, callback ? `/${callback.slice(1)}` : "/account");
	},
};
