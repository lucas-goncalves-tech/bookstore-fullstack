import { Session } from "@prisma/client";

export interface ICreateSessionInput {
  userId: string;
  refreshHash: string;
  expiresAt: Date;
}

export interface ISessionsRepository {
  create(data: ICreateSessionInput): Promise<void>;
  findByTokenHash(refreshToken: string): Promise<Session | null>;
  revokeByTokenHash(refreshToken: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
