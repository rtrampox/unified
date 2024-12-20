import { z } from "zod";

const envSchema = z.object({
	BACKEND_URL: z.string(),
	INPUT_FILE_PATH: z.string().optional(),
});

envSchema.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}
