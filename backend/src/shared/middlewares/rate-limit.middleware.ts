import rateLimit from "express-rate-limit";
import { env } from "../../core/config/env";

const ttl = 15 * 60 * 1000;
const isProd = env.NODE_ENV === "production";

export const authRateLimit = rateLimit({
  windowMs: ttl,
  max: isProd ? 5 : 1000,
  message: "Muitas tentativas de login, tente novamente mais tarde",
});

export const registerRateLimit = rateLimit({
  windowMs: ttl,
  max: isProd ? 10 : 1000,
  message: "Muitas tentativas de cadastro, tente novamente mais tarde",
});

export const globalRateLimit = rateLimit({
  windowMs: ttl,
  max: isProd ? 100 : 1000,
  message: "Muitas requisições, tente novamente mais tarde",
});
