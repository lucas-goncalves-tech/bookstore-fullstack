import { CookieOptions } from "express";
import { env } from "../../core/config/env";

function parseExpiration(exp: string) {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

export const SID_COOKIE =
  env.NODE_ENV === "production" ? "__Secure-sid" : "sid";

export const SID_COOKIE_OPTIONS = (maxAge?: number): CookieOptions => ({
  sameSite: "lax",
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  maxAge: maxAge ? maxAge : parseExpiration(env.JWT_EXPIRES),
});
