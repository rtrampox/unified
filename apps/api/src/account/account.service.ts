import { BadRequestException, Injectable } from "@nestjs/common";
import { DBService } from "src/providers/db/db.service";
import { ReqSession } from "src/guards/auth/auth.decorator";
import { UpdatePasswordDto } from "./dto/update-account.dto";
import { MultifactorService } from "src/providers/multifactor/multifactor.service";
import { passwordService } from "src/providers/password";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from "@nestjs/config";
import { configConstants } from "src/lib/config/constants";
import { purgeCFCache } from "src/lib/purge-cf-cache";

@Injectable()
export class AccountService {
	constructor(
		private readonly db: DBService,
		private readonly mfaSvc: MultifactorService,
		private configService: ConfigService,
	) {}

	async updatePassword(body: UpdatePasswordDto, session: ReqSession) {
		const transaction = await this.db.$transaction(async (tx) => {
			const user = await tx.user.findUnique({ where: { id: session.user.id } });
			if (!user) {
				throw new BadRequestException("User not found");
			}

			if (!(await passwordService.Compare(body.password, user.passwordHash))) {
				throw new BadRequestException("Invalid password");
			}

			if (user.otp && !body.otp?.code) {
				throw new BadRequestException("MFA is enabled");
			}

			if (user.otp && !(await this.mfaSvc.verify(user.otpSecret, body.otp!.code))) {
				throw new BadRequestException("Invalid MFA code");
			}

			const newPasswordHash = await passwordService.Hash(body.newPassword);

			await tx.user.update({
				where: { id: session.user.id },
				data: { passwordHash: newPasswordHash },
			});

			if (body.revokeSession) {
				await tx.session.deleteMany({
					where: {
						userId: user.id,
					},
				});
			}

			if (body.revokeTrustedDevices) {
				await tx.trustedDevice.deleteMany({
					where: {
						userId: user.id,
					},
				});
			}

			return { user: { id: user.id }, ok: true };
		});

		return transaction;
	}

	async getAuthorizedClients(session: ReqSession) {
		const clients = await this.db.authorizedClient.findMany({
			where: { userId: session.user.id },
			include: {
				client: {
					select: {
						id: true,
						name: true,
						picture: true,
						contactEmail: true,
					},
				},
			},
		});

		return clients;
	}

	async revokeClient(id: string, session: ReqSession) {
		await this.db
			.$transaction(async (tx) => {
				const client = await tx.authorizedClient.delete({
					where: { clientId_userId: { clientId: id, userId: session.user.id } },
				});
				if (!client) {
					throw new BadRequestException("Unable to find authorized client");
				}

				await tx.refreshToken.deleteMany({
					where: { userId: session.user.id, clientId: id },
				});
			})
			.catch((e) => {
				console.error(e);
				throw new BadRequestException("Unable to find authorized client");
			});

		return { user: { id: session.user.id }, ok: true };
	}

	async getSignedProfilePictureUrl(session: ReqSession) {
		const bucket = this.configService.get("AWS_BUCKET");
		const region = this.configService.get("AWS_REGION");
		const endpoint = this.configService.get("AWS_ENDPOINT_URL");
		const accessKeyId = this.configService.get("AWS_ACCESS_KEY_ID");
		const secretAccessKey = this.configService.get("AWS_SECRET_ACCESS_KEY");

		const client = new S3Client({
			region,
			endpoint,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});

		const lastModified = new Date().toISOString();

		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: configConstants.PROFILE_PICTURE_KEY(session.user.id),
			ContentType: "image/webp",
			Metadata: {
				"Content-Type": "image/webp",
				"X-Rtrampox-User-Id": session.user.id,
				"Last-Modified": lastModified,
			},
		});

		const signableHeaders = new Set(["content-type", "x-rtrampox-user-id", "last-modified"]);
		// expires in 5 min
		const expiresIn = 300;

		const signedUrl = await getSignedUrl(client, command, {
			expiresIn,
			signableHeaders,
		});

		const transaction = await this.db.$transaction(async (tx) => {
			const user = await tx.user.findUnique({ where: { id: session.user.id } });
			if (!user) {
				throw new BadRequestException("User not found");
			}

			const picture = configConstants.USERCONTENT_PROFILE_URL(session.user.id).toString();
			await tx.user.update({
				where: { id: session.user.id },
				data: { picture },
			});

			return { user: { id: user.id, picture } };
		});

		return {
			user: transaction,
			signedUrl,
			requiredHeaders: Array.from(signableHeaders),
			expiresIn,
			lastModified,
		};
	}

	async completeProfilePictureUpload(session: ReqSession) {
		const transaction = await this.db.$transaction(async (tx) => {
			const user = await tx.user.findUnique({ where: { id: session.user.id } });
			if (!user) {
				throw new BadRequestException("User not found");
			}

			const picture = configConstants.USERCONTENT_PROFILE_URL(session.user.id).toString();
			await tx.user.update({
				where: { id: session.user.id },
				data: { picture },
			});

			return { user: { id: user.id, picture } };
		});

		const cache = await purgeCFCache(
			[configConstants.USERCONTENT_PROFILE_URL(session.user.id).toString()],
			this.configService,
		);
		if (!cache) {
			console.error("Failed to purge cache");
		}

		return transaction;
	}
}
