import { ConfigService } from "@nestjs/config";

type PurgeCacheApiResponse = {
	success: boolean;
	errors: string[];
	messages: string[];
	result: Record<string, unknown>;
};

export async function purgeCFCache(url: string[], cfgService: ConfigService) {
	const CF_EMAIL = cfgService.get("CF_EMAIL") as string;
	const CF_API_KEY = cfgService.get("CF_API_KEY") as string;
	const CF_ZONE_ID = cfgService.get("CF_ZONE_ID") as string;

	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Auth-Email": CF_EMAIL,
				"X-Auth-Key": CF_API_KEY,
			},
			body: JSON.stringify({ files: url }),
		});

		const result: PurgeCacheApiResponse = await response.json();

		console.debug("[DEBUG] Purge cache result: ", result);

		return response.ok ? result.success : false;
	} catch (error) {
		console.error("[ERROR] Purge cache error: ", error);

		return false;
	}
}
