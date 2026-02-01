import jwt from "jsonwebtoken";
import { env } from "../core/config/env";
import z from "zod";

const userPayloadSchema = z.object({
    sid: z.string(),
    role: z.enum(["USER", "ADMIN"]),
})

export type UserPayload = z.infer<typeof userPayloadSchema>

export function generateToken(payload: UserPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string) {
    return userPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
}
