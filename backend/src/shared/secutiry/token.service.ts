import jwt from "jsonwebtoken";
import { env } from "../../core/config/env";

interface UserPayload {
  sid: string;
  role: "USER" | "ADMIN";
}

export function generateToken(payload: UserPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}
