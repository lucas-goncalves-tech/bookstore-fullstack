import jwt from "jsonwebtoken";
import { env } from "../core/config/env";
import z from "zod";
import crypto from "crypto";
import { parseExpiration } from "../shared/contants/sid-cookie";

const accessPayloadSchema = z.object({
  sub: z.uuid(),
  role: z.enum(["USER", "ADMIN"]),
  type: z.literal("access"),
});

const refreshPayloadSchema = z.object({
  sub: z.uuid(),
  type: z.literal("refresh"),
});

export type AccessPayload = z.infer<typeof accessPayloadSchema>;
export type RefreshPayload = z.infer<typeof refreshPayloadSchema>;

const ALLOWED_ALGORITHMS: jwt.Algorithm[] = ["HS256"];

export function generateAccessToken(payload: Omit<AccessPayload, "type">) {
  return jwt.sign(
    {
      sub: payload.sub,
      role: payload.role,
      type: "access",
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES as jwt.SignOptions["expiresIn"],
      algorithm: ALLOWED_ALGORITHMS[0],
    },
  );
}

export function verifyAccessToken(token: string) {
  return accessPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
}

export function generateRefreshToken(userId: string) {
  const expiresAt = new Date(
    Date.now() + parseExpiration(env.JWT_REFRESH_EXPIRES),
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"],
      algorithm: ALLOWED_ALGORITHMS[0],
    },
  );

  return { refreshToken, expiresAt };
}

export function verifyRefreshToken(token: string) {
  return refreshPayloadSchema.parse(
    jwt.verify(token, env.JWT_REFRESH_SECRET, {
      algorithms: ALLOWED_ALGORITHMS,
    }),
  );
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
