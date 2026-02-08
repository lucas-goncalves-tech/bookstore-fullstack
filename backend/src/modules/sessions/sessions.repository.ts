import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import {
  ICreateSessionInput,
  ISessionsRepository,
} from "./interface/sessions.interface";
import { Session } from "@prisma/client";

@injectable()
export class SessionsRepository implements ISessionsRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async create({ userId, refreshHash, expiresAt }: ICreateSessionInput) {
    await this.prisma.session.create({
      data: {
        userId,
        refreshHash,
        expiresAt,
      },
    });
  }

  async updateSession(id: string, data: Partial<Session>) {
    await this.prisma.session.update({
      where: {
        id,
      },
      data,
    });
  }

  async findByTokenHash(refreshToken: string) {
    return this.prisma.session.findUnique({
      where: {
        refreshHash: refreshToken,
      },
    });
  }

  async revokeByTokenHash(refreshToken: string) {
    await this.prisma.session.update({
      where: {
        refreshHash: refreshToken,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllByUserId(userId: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
