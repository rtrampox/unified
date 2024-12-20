import { Request, Response } from "express";
import { Session } from "@prisma/client";
import { DBService } from "../db/db.service";
import { Injectable } from "@nestjs/common";

type SessionReturn = [Session, true] | [null, false];

@Injectable()
export class SessionService {
  constructor(private readonly db: DBService) {}

  writeCookie(session: Session, res: Response) {
    res.cookie("ssid", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost",
      path: "/",
    });

    return res;
  }

  async finishSession(req: Request, res: Response) {
    res.clearCookie("ssid", { domain: "localhost", path: "/" });
    const ssid = req.cookies.ssid;
    if (!ssid) {
      return res;
    }

    try {
      await this.delete(ssid);
    } catch (error) {
      console.error(error);
    }

    return res;
  }

  async create(
    userId: string,
    { userAgent, ip }: { userAgent?: string; ip?: string }
  ): Promise<SessionReturn> {
    try {
      const session = await this.db.session.create({
        data: {
          userId,
          requestIp: ip || "Unknown",
          userAgent: userAgent || "Unknown Device",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return [session, true];
    } catch (error) {
      console.error(error);
      return [null, false];
    }
  }

  async get(sessionId: string): Promise<SessionReturn> {
    try {
      const session = await this.db.session.findUnique({
        where: { id: sessionId },
      });
      if (!session) {
        return [null, false];
      }

      return [session, true];
    } catch (error) {
      console.error(error);
      return [null, false];
    }
  }

  async delete(sessionId: string): Promise<boolean> {
    const remove = await this.db.session.delete({ where: { id: sessionId } });

    return typeof remove !== "undefined";
  }

  async getAll(userId: string): Promise<Session[]> {
    const sessions = await this.db.session.findMany({ where: { userId } });
    if (sessions.length === 0) {
      return [];
    }

    return sessions;
  }

  async deleteAll(userId: string): Promise<boolean> {
    try {
      const removeAll = await this.db.session.deleteMany({ where: { userId } });
      if (removeAll && removeAll.count) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
