import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	keys: z.array(
		z.object({
			kid: z.string(),
			use: z.string(),
			alg: z.string(),
			kty: z.string(),
			n: z.string(),
			e: z.string(),
		}),
	),
});

export class JwksResponseDto extends createZodDto(schema) {}
