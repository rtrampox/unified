import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DBService } from "src/providers/db/db.service";
import { passwordService } from "src/providers/password";
import { Request } from "express";
import { RegisterUserDto } from "../dto/register/register-user.dto";
import { Register } from "../entities/register/register.entity";
import { SessionService } from "src/providers/sessions/session.service";
import { configConstants } from "src/lib/config/constants";

@Injectable()
export class RegisterService {
	constructor(private readonly db: DBService, private sessions: SessionService) {}

	async create({ password, ...input }: RegisterUserDto, req: Request): Promise<Register> {
		const emailExists = await this.db.user.findFirst({
			where: { email: { equals: input.email, mode: "insensitive" } },
		});
		if (emailExists) {
			throw new ConflictException(`User with email ${input.email} already exists`);
		}

		const usernameExists = await this.db.user.findFirst({
			where: { username: { equals: input.username, mode: "insensitive" } },
		});
		if (usernameExists) {
			throw new ConflictException(`User with username ${input.username} already exists`);
		}

		const { passwordHash, otpSecret, otp, otpType, ...user } = await this.db.$transaction(async (tx) => {
			const user = await this.db.user.create({
				data: {
					...input,
					passwordHash: await passwordService.Hash(password),
				},
			});

			await tx.user.update({
				where: { id: user.id },
				data: {
					picture: configConstants.USERCONTENT_PROFILE_URL(user.id).toString(),
				},
			});

			return user;
		});

		const [session, ok] = await this.sessions.create(user.id, {
			ip: req.ip || "",
			userAgent: req.headers["user-agent"] || "",
		});
		if (!ok) {
			throw new InternalServerErrorException("Failed to create session");
		}

		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
			session,
		};
	}
}
