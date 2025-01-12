import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DBService } from "src/providers/db/db.service";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { authGuardUserSelect, IAuthRequest } from "./auth.constants";
import { SessionService } from "src/providers/sessions/session.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly db: DBService, private sessions: SessionService, private reflector: Reflector) {}

	private error = new UnauthorizedException("Unauthorized", {
		cause: "FROM_GUARD",
	});

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
			throw this.error;
		}

		const [sess, ok] = await this.sessions.get(ssid);
		if (!ok) {
			throw this.error;
		}

		const user = await this.db.user.findUnique({
			where: { id: sess.userId },
			select: authGuardUserSelect,
		});
		if (!user) {
			throw this.error;
		}

		req.auth = {
			session: sess,
			user: user,
		};

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
