import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { ReqSession } from "src/guards/auth/auth.decorator";
import { DBService } from "src/providers/db/db.service";
import { passwordService } from "src/providers/password";
import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";

@Injectable()
export class ClientsService {
	constructor(private readonly db: DBService) {}

	private publicClientSelect: Prisma.ClientSelect = {
		id: true,
		name: true,
		picture: true,
		enabled: true,
		contactEmail: true,
		privacyPolicyUrl: true,
		termsUrl: true,
	};

	private clientSelect: Prisma.ClientSelect = {
		...this.publicClientSelect,
		scopes: true,
		redirectUri: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
	};

	private generateSecret() {
		return `ucs|${Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url")}`;
	}

	/**
	 * @throws ConflictException
	 */
	async createClient(body: CreateClientDto, session: ReqSession) {
		const exists = await this.db.client.findFirst({
			where: { userId: session.user.id, name: body.name },
			select: { id: true },
		});
		if (exists) {
			throw new ConflictException(`Client with name ${body.name} already exists`);
		}

		const secret = this.generateSecret();
		const hashed = await passwordService.Hash(secret);

		const client = await this.db.client.create({
			data: {
				...body,
				secretHash: hashed,
				userId: session.user.id,
			},
			select: this.clientSelect,
		});

		return {
			user: { id: client.userId },
			client: {
				...client,
				secret,
			},
		};
	}

	async findAll(session: ReqSession) {
		return await this.db.client.findMany({
			where: { userId: session.user.id },
			select: this.clientSelect,
		});
	}

	async renewSecret(id: string, session: ReqSession) {
		const transaction = await this.db.$transaction(async (tx) => {
			const client = await tx.client.findFirst({
				where: { id, userId: session.user.id },
				select: this.clientSelect,
			});
			if (!client) {
				throw new ConflictException(`Client with id ${id} not found`);
			}

			const secret = this.generateSecret();

			await tx.client.update({
				where: { id },
				data: { secretHash: await passwordService.Hash(secret) },
			});

			return { client, secret };
		});
		return {
			user: { id: transaction.client.userId },
			client: {
				...transaction.client,
				secret: transaction.secret,
			},
		};
	}

	async updateClient(id: string, updateClientDto: UpdateClientDto, session: ReqSession) {
		const transaction = await this.db.$transaction(async (tx) => {
			const client = await tx.client.findFirst({
				where: { id, userId: session.user.id },
			});
			if (!client) {
				throw new NotFoundException(`Client with id ${id} not found`);
			}

			return await tx.client.update({
				where: { id },
				data: updateClientDto,
				select: this.clientSelect,
			});
		});

		return transaction;
	}

	async switchClient(id: string, session: ReqSession) {
		const transaction = await this.db.$transaction(async (tx) => {
			const client = await tx.client.findFirst({
				where: { id, userId: session.user.id },
				select: this.clientSelect,
			});
			if (!client) {
				throw new NotFoundException(`Client with id ${id} not found`);
			}

			return await tx.client.update({
				where: { id },
				data: { enabled: !client.enabled },
				select: this.clientSelect,
			});
		});

		return {
			user: { id: transaction.userId },
			client: transaction,
		};
	}
}
