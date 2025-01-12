import type { RequestHandler } from "./$types";
import { getJwks } from "@/api";

export const GET: RequestHandler = async () => {
	const { status, data, headers } = await getJwks();

	return new Response(JSON.stringify(data), {
		status,
		headers: new Headers(headers),
	});
};
