import { defineConfig } from "orval";

export default defineConfig({
	api: {
		input: "http://10.1.1.17:3000/swagger/json",
		output: {
			target: "./src/lib/api/index.ts",
			client: "fetch",
			httpClient: "fetch",
			baseUrl: "http://10.1.1.17:3000",
			override: {
				mutator: {
					path: "./src/lib/api/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
	},
});
