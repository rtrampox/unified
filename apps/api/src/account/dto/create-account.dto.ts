import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	code: z.string().length(6),
});

export class ConfirmTwoFactorDto extends createZodDto(schema) {}
