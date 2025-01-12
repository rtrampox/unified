import type { RequestHandler } from "./$types";
import { getOpenidConfiguration } from "@/api";

export const GET: RequestHandler = async () => {
	const { status, data, headers } = await getOpenidConfiguration();

	return new Response(JSON.stringify(data), {
		status,
		headers: new Headers(headers),
	});
};
