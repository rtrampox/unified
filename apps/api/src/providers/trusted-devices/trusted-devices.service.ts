import { Request, Response } from "express";
import { DBService } from "src/providers/db/db.service";
import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

type ReturnData = [Prisma.TrustedDeviceGetPayload<{}>, true] | [null, false];

@Injectable()
export class TrustedDevicesService {
	constructor(private readonly db: DBService) {}

	readCookie(req: Request): string | undefined {
		return req.cookies["tdid"] || undefined;
	}

	writeCookie(deviceId: string, res: Response) {
		res.cookie("tdid", deviceId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			domain: process.env.FRONT_PUBLIC_URL ?? "localhost",
			maxAge: 1000 * 60 * 60 * 24 * 30,
		});

		return res;
	}

	/**
	 * Create a trusted device for a user account
	 * @param userId string
	 * @param userAgent string
	 * @param ip string
	 * @returns ReturnData
	 */
	async create(userId: string, { userAgent, ip }: { userAgent: string; ip: string }): Promise<ReturnData> {
		try {
			const device = await this.db.trustedDevice.create({
				data: {
					userId,
					userAgent,
					ip,
				},
			});

			return [device, true];
		} catch (error) {
			console.error(error);
			return [null, false];
		}
	}

	/**
	 * Get a trusted device by its id
	 * @param deviceId string
	 * @returns ReturnData
	 */
	async get(deviceId: string): Promise<ReturnData> {
		try {
			const data = await this.db.trustedDevice.findUnique({
				where: { id: deviceId },
			});
			if (!data) {
				return [null, false];
			}

			return [data, true];
		} catch (error) {
			console.error(error);
			return [null, false];
		}
	}

	/**
	 * Delete a trusted device by its id
	 * @param deviceId string
	 * @returns boolean
	 */
	async delete(deviceId: string): Promise<boolean> {
		try {
			const result = await this.db.trustedDevice.delete({
				where: { id: deviceId },
			});
			if (!result) {
				return false;
			}
		} catch (error) {
			console.error(error);
			return false;
		}

		return true;
	}

	/**
	 * Get all trusted devices for a user account
	 * @param userId string
	 * @returns Prisma.TrustedDeviceGetPayload<{}>[]
	 */
	async getAll(userId: string): Promise<Prisma.TrustedDeviceGetPayload<{}>[]> {
		try {
			const data = await this.db.trustedDevice.findMany({
				where: { userId },
			});
			if (!data) {
				return [];
			}

			return data;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	/**
	 * Delete all trusted devices for a user account
	 * @param userId string
	 * @returns boolean
	 */
	async deleteAll(userId: string): Promise<boolean> {
		try {
			const data = await this.db.trustedDevice.deleteMany({
				where: { userId },
			});
			if (!data) {
				return false;
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
