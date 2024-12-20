import { defineConfig } from "orval";
import "dotenv/config";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://10.1.1.17:3000";
const INPUT_FILE = process.env.INPUT_FILE_PATH ?? `${BACKEND_URL}/swagger/json`;

export default defineConfig({
	api: {
		input: INPUT_FILE,
		output: {
			target: "./src/lib/api/index.ts",
			client: "fetch",
			httpClient: "fetch",
			baseUrl: `${BACKEND_URL}`,
			override: {
				mutator: {
					path: "./src/lib/api/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
	},
});
