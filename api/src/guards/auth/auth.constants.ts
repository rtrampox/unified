import { Prisma } from "@prisma/client";
import { Request } from "express";
import { Session } from "@prisma/client";

export const authGuardUserSelect = {
	id: true,
	email: true,
	firstName: true,
	lastName: true,
	username: true,
	emailVerified: true,
	otp: true,
	otpType: true,
	picture: true,
} satisfies Prisma.UserSelect;

export interface IAuthRequest extends Request {
	auth?: {
		session: Session;
		user: Prisma.UserGetPayload<{ select: typeof authGuardUserSelect }>;
	};
}
