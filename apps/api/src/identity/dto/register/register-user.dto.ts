import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { CaptchaDtoSchema } from "src/guards/captcha/dto/captcha.dto";

const registerSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().min(3),
	email: z.string().email(),
	phone: z.string().optional().nullable(),
	username: z
		.string()
		.min(3)
		.regex(/^[a-zA-Z0-9]+$/, { message: "Username must contain only letters and numbers" }),
	password: z
		.string()
		.min(8)
		.refine((value) => value),
});

export class RegisterUserDto extends createZodDto(
	z.object({ ...registerSchema.extend(CaptchaDtoSchema.shape).shape }),
) {}
export class UpdateUserDto extends createZodDto(registerSchema.partial()) {}
