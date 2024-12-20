import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const updatePasswordSchema = z
	.object({
		password: z.string().min(8),
		newPassword: z.string().min(8),
		otp: z
			.object({
				code: z.string().min(6).max(6),
			})
			.optional(),
		revokeSession: z.boolean().optional().default(false),
		revokeTrustedDevices: z.boolean().optional().default(false),
	})
	.transform((data) => {
		if (data.revokeTrustedDevices) {
			data.revokeSession = true;
		}
		return data;
	});

const updateProfilePictureSchema = z.object({
	picture: z
		.string()
		.url()
		.transform((url) => new URL(url))
		.refine((url) => url.origin.startsWith(process.env.AWS_BUCKET_URL ?? ""), {
			message: "Invalid picture url",
		}),
});

export class UpdatePasswordDto extends createZodDto(updatePasswordSchema) {}
