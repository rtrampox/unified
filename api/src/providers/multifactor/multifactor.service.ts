import { Injectable } from "@nestjs/common";
import { TOTP, Secret } from "otpauth";
import * as qrcode from "qrcode";
import { DBService } from "src/providers/db/db.service";
import { UserLoginSelect } from "src/identity/login/login.constants";

@Injectable()
export class MultifactorService {
	constructor(private readonly db: DBService) {}
	/**
	 * Initialize app MFA for the user and return the secret, url, and qr code
	 * @param username: string
	 * @param userId: string
	 * @returns { secret: string, url: string, qrcode: string }
	 */
	async initAppMFA(username: string, userId: string) {
		const secret = new Secret();

		const totp = new TOTP({
			issuer: "Unified Account",
			label: username,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret,
		});

		await this.db.user.update({
			where: { id: userId },
			data: { otp: false, otpType: "APP", otpSecret: secret.base32 },
		});

		const url = totp.toString();
		const qr = await qrcode.toDataURL(url);

		return { secret: secret.base32, url, qrcode: qr };
	}

	/**
	 * Confirm initialization of app MFA for the user by verifying the code
	 * @param user: UserLoginSelect
	 * @param code: string
	 * @returns boolean
	 */
	async confirmAppMFA({ otpSecret, id, otpType }: UserLoginSelect, token: string) {
		try {
			if (otpType !== "APP" || !otpSecret) {
				return false;
			}

			const totp = new TOTP({
				algorithm: "SHA1",
				digits: 6,
				period: 30,
				secret: otpSecret,
			});

			const valid = totp.validate({ token, window: 1 });

			if (valid !== null) {
				await this.db.user.update({
					where: { id },
					data: { otp: true },
				});

				return true;
			}

			return false;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	/**
	 * Validate the user's MFA code
	 * @param secret: string
	 * @param code: string
	 * @returns boolean
	 */
	async verify(secret: string | null, code: string) {
		try {
			if (!secret) {
				return false;
			}
			const totp = new TOTP({
				algorithm: "SHA1",
				digits: 6,
				period: 30,
				secret: Secret.fromBase32(secret),
			});
			if (totp.validate({ token: code, window: 1 }) !== null) {
				return true;
			}

			return false;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	/**
	 * Disable the user's MFA
	 * @param user: UserLoginSelect
	 * @param code: string
	 * @returns boolean
	 */
	async disable(user: UserLoginSelect, code: string) {
		try {
			const valid = this.verify(user.otpSecret, code);
			if (!valid) {
				return false;
			}
			await this.db.user.update({
				where: { id: user.id },
				data: { otp: false, otpSecret: null, otpType: null },
			});

			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
}
