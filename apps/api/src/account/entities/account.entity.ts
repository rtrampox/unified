import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const enableSchema = z.object({
	user: z.object({ id: z.string() }),
	enabled: z.boolean(),
	message: z.string(),
	qrcode: z.string(),
	url: z.string(),
});

const confirmSchema = z.object({
	user: z.object({ id: z.string() }),
	enabled: z.boolean(),
});

const getSignedUrlSchema = z.object({
	user: z.object({ id: z.string(), picture: z.string() }),
	signedUrl: z.string(),
	requiredHeaders: z.array(z.string()),
	expiresIn: z.string(),
	lastModified: z.string(),
});

export class EnableTwoFactorResponse extends createZodDto(enableSchema) {}
export class ConfirmTwoFactorResponse extends createZodDto(confirmSchema) {}
export class DisableTwoFactorResponse extends createZodDto(confirmSchema) {}
export class GetSignedUrlResponse extends createZodDto(getSignedUrlSchema) {}
