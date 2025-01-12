import { BadRequestException, Injectable } from "@nestjs/common";
import { IUseAccessTokenGuard, UseAccessTokenGuard } from "src/guards/access-token/access-token.decorator";
import { UserInfoDto } from "./entities/userinfo.entitity";
import { DBService } from "src/providers/db/db.service";
import { Scopes, User } from "@prisma/client";

@Injectable()
export class UserinfoService {
	constructor(private readonly db: DBService) {}

	async getUserInfo(@UseAccessTokenGuard() token: IUseAccessTokenGuard): Promise<UserInfoDto> {
		const user = await this.db.user.findUnique({ where: { id: token.claims.payload.sub } });
		if (!user) {
			throw new BadRequestException("Unable to find an user associated with the provided token.");
		}

		return this.parseScopes(user, token.claims.payload.scope.split(" ") as Scopes[]);
	}

	parseScopes(user: User, scopes: Scopes[]): UserInfoDto {
		const userInfo = new UserInfoDto();

		for (const scope of scopes) {
			switch (scope) {
				case "email":
					userInfo.email = user.email;
					userInfo.email_verified = user.emailVerified;
					break;
				case "phone":
					userInfo.phone = user.phone;
					userInfo.phone_verified = user.phoneVerified;
					break;
				case "profile":
					userInfo.preferred_username = user.username;
					userInfo.given_name = user.firstName;
					userInfo.family_name = user.lastName;
					userInfo.name = `${user.firstName} ${user.lastName}`;
					userInfo.picture = user.picture;
					break;
				case "openid":
					userInfo.sub = user.id;
					break;
				case "offline_access":
					userInfo.updated_at = user.updatedAt.toISOString();
					break;
			}
		}

		userInfo.scope = scopes.join(" ");

		return userInfo;
	}
}
