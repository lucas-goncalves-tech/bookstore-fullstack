import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.repository";
import {
  ICreateUser,
  ICreateUserInput,
  ISafeUser,
  IUsersRepository,
} from "../users/interfaces/user.interface";
import { ConflictError } from "../../shared/errors/conflict.error";
import { env } from "../../core/config/env";
import { ILoginInput } from "./interface/auth.interface";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../services/token.service";
import { ForbiddenError } from "../../shared/errors/forbidden.error";
import { SessionsRepository } from "../sessions/sessions.repository";
import { parseExpiration } from "../../shared/contants/sid-cookie";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: IUsersRepository,
    @inject(SessionsRepository)
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async create(data: ICreateUserInput): Promise<ISafeUser> {
    const userExist = await this.usersRepository.findByKey("email", data.email);
    if (userExist) {
      throw new ConflictError("Email já cadastrado");
    }

    const hash = await bcrypt.hash(data.password, env.SALT);
    const newUser: ICreateUser = {
      email: data.email,
      name: data.name,
      passwordHash: hash,
    };

    const result = await this.usersRepository.create(newUser);

    //eslint-disable-next-line
    const { id, passwordHash, ...safe } = result;
    return safe;
  }

  async login(
    data: ILoginInput,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userExist = await this.usersRepository.findByKey("email", data.email);
    const FAKE_HASH =
      "$2b$10$D7Y/.IVUm.SFcnYQE4dlb.BPJtVCwmOV/kaehohZrWeodfAEP8qqS";
    const hashToCompare = userExist ? userExist.passwordHash : FAKE_HASH;
    const isPassValid = await bcrypt.compare(data.password, hashToCompare);

    if (!userExist || !isPassValid) {
      throw new UnauthorizedError("Email ou senha inválido!");
    }

    if (userExist.bannedAt) {
      throw new ForbiddenError(
        `Usuário banido! Motivo: ${userExist.banReason}`,
      );
    }

    const accessToken = generateAccessToken({
      sub: userExist.id,
      role: userExist.role,
    });

    const { refreshToken, expiresAt } = generateRefreshToken(userExist.id);

    await this.sessionsRepository.create({
      userId: userExist.id,
      refreshHash: hashToken(refreshToken),
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    verifyRefreshToken(refreshToken);

    const session = await this.sessionsRepository.findByTokenHash(
      hashToken(refreshToken),
    );

    if (!session || session.revokedAt) {
      throw new UnauthorizedError("Sessão inválida ou revogada!");
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedError("Sessão expirada!");
    }

    const user = await this.usersRepository.findByKey("id", session.userId);
    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado!");
    }

    if (user.bannedAt) {
      throw new ForbiddenError(`Usuário banido! Motivo: ${user.banReason}`);
    }

    const newAccessToken = generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    const now = Date.now();
    const expiresAt = session.expiresAt;
    const timeUntilExpiration = expiresAt.getTime() - now;
    const ttl = parseExpiration(env.JWT_REFRESH_EXPIRES);
    let tokenToReturn = refreshToken;
    let expiresMs = timeUntilExpiration;
    if (timeUntilExpiration < ttl / 2) {
      const { refreshToken: newRefreshToken, expiresAt: newExpiresAt } =
        generateRefreshToken(user.id);
      tokenToReturn = newRefreshToken;
      expiresMs = ttl;
      await this.sessionsRepository.updateSession(session.id, {
        expiresAt: newExpiresAt,
        refreshHash: hashToken(newRefreshToken),
      });
    }

    return {
      accessToken: newAccessToken,
      refreshToken: tokenToReturn,
      expiresMs,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const hashedToken = hashToken(refreshToken);
    await this.sessionsRepository.revokeByTokenHash(hashedToken);
  }
}
