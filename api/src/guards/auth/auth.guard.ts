import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DBService } from "src/providers/db/db.service";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { authGuardUserSelect, IAuthRequest } from "./auth.constants";
import { SessionService } from "src/providers/sessions/session.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly db: DBService,
		private sessions: SessionService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const req = context.switchToHttp().getRequest<IAuthRequest>();
		const ssid = this.extractSessionId(req);
		if (!ssid) {
			throw new UnauthorizedException("Unauthorized");
		}

		try {
			const [sess, ok] = await this.sessions.get(ssid);
			if (!ok) {
				throw new UnauthorizedException("Unauthorized");
			}

			const user = await this.db.user.findUnique({
				where: { id: sess.userId },
				select: authGuardUserSelect,
			});
			if (!user) {
				throw new UnauthorizedException("Unauthorized");
			}

			req.auth = {
				session: sess,
				user: user,
			};
		} catch {
			throw new UnauthorizedException("Unauthorized");
		}

		return true;
	}

	private extractSessionId(req: Request): string | undefined {
		let ssid = req.cookies["ssid"];
		if (!ssid) {
			const [type, ssid] = req.headers["authorization"]?.split(" ") ?? [];
			return type === "Ssid" ? ssid : undefined;
		}

		return ssid;
	}
}
