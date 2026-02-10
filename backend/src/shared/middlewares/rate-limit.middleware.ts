import rateLimit from "express-rate-limit";

const ttl = 15 * 60 * 1000;
const isTest = process.env.NODE_ENV === "test";

export const authRateLimit = rateLimit({
  windowMs: ttl,
  max: isTest ? 1000 : 5,
  message: "Muitas tentativas de login, tente novamente mais tarde",
});

export const registerRateLimit = rateLimit({
  windowMs: ttl,
  max: isTest ? 1000 : 15,
  message: "Muitas tentativas de cadastro, tente novamente mais tarde",
});

export const globalRateLimit = rateLimit({
  windowMs: ttl,
  max: isTest ? 1000 : 100,
  message: "Muitas requisições, tente novamente mais tarde",
});
