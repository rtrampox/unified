import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { CaptchaDtoSchema } from "src/guards/captcha/dto/captcha.dto";

const schema = z.object({
	identity: z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.refine((value) => value),
		trust: z.boolean().optional().default(false),
	}),
	...CaptchaDtoSchema.shape,
});

export class LoginUserDto extends createZodDto(schema) {}
