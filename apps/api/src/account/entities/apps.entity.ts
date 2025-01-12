import { createZodDto } from "nestjs-zod";
import { scopesEnum } from "src/clients/dto/client.dto";
import { z } from "zod";

const schema = z.array(
	z.object({
		id: z.string(),
		clientId: z.string(),
		userId: z.string(),
		scopes: z.array(scopesEnum),
		createdAt: z.string(),
		updatedAt: z.string(),
		client: z.object({
			id: z.string(),
			name: z.string(),
			picture: z.string().nullable(),
			contactEmail: z.string(),
		}),
	}),
);

export class GetAppsResponseDto extends createZodDto(schema) {}
