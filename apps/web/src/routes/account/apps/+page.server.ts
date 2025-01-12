import { getAuthorizedClients, revokeClient, type HttpExceptionEntity } from "@/api";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { data, status } = await getAuthorizedClients();
	if (status !== 200) {
		return {
			message: (data as unknown as HttpExceptionEntity).error.message,
			apps: null,
		};
	}

	return {
		apps: data,
	};
};

export const actions: Actions = {
	async revoke({ url }) {
		const { status } = await revokeClient(url.searchParams.get("client_id")!);
		if (status !== 200) {
			return { message: "Failed to revoke client", ok: false };
		}
		return {
			message: "Client revoked",
			ok: true,
		};
	},
};
