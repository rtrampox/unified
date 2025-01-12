import { Prisma } from "@prisma/client";

export const userLoginSelect = (devId?: string): Prisma.UserSelect => {
	return {
		id: true,
		email: true,
		passwordHash: true,
		otp: true,
		otpType: true,
		otpSecret: true,
		TrustedDevice: {
			where: { id: devId },
			select: { id: true },
			take: 1,
		},
	};
};

export type UserLoginSelect = Prisma.UserGetPayload<{
	select: ReturnType<typeof userLoginSelect>;
}>;
