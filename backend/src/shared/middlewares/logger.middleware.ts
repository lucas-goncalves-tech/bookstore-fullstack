import { Request, Response, NextFunction } from "express";
import { env } from "../../core/config/env";

const REDACTED_KEYS = new Set([
  "password",
  "confirmpassword",
  "passwordhash",
  "refreshhash",
  "token",
  "access_token",
]);

/**
 * Remove quebras de linha (\n e \r) para prevenir Log Forgery / Log Injection (CWE-117)
 */
function sanitizeForLog(input: string): string {
  return input.replace(/[\r\n]/g, " ");
}

/**
 * Funcao recursiva para varrer objetos e mascarar chaves sensiveis
 */
function redactData(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(redactData);

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (REDACTED_KEYS.has(lowerKey)) {
      redacted[key] = "***REDACTED***";
    } else if (typeof value === "object") {
      redacted[key] = redactData(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

const colorizeStatus = (status: number) => {
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // Red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // Yellow
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // Cyan
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`; // Green
  return `\x1b[37m${status}\x1b[0m`; // White
};

const colorizeMethod = (method: string) => {
  switch (method) {
    case "GET":
      return `\x1b[34m[GET]\x1b[0m`; // Blue
    case "POST":
      return `\x1b[32m[POST]\x1b[0m`; // Green
    case "PUT":
      return `\x1b[33m[PUT]\x1b[0m`; // Yellow
    case "PATCH":
      return `\x1b[33m[PATCH]\x1b[0m`; // Yellow
    case "DELETE":
      return `\x1b[31m[DELETE]\x1b[0m`; // Red
    default:
      return `\x1b[37m[${method}]\x1b[0m`; // White
  }
};

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Ignora rotas de infra para não acumular spam no console
  if (
    req.originalUrl === "/health" ||
    req.originalUrl.startsWith("/api-docs")
  ) {
    return next();
  }

  // Não exibe logs durante testes do Vitest para não destruir a leitura limpa do 'npm test'
  if (env.NODE_ENV === "test") {
    return next();
  }

  const start = performance.now();

  res.on("finish", () => {
    const duration = (performance.now() - start).toFixed(2);

    // So loggamos o body nas requisicoes transacionais (Mutações) e se existir de fato
    const hasBody =
      ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
      Object.keys(req.body || {}).length > 0;

    let logMessage = `${colorizeMethod(req.method)} ${req.originalUrl} - ${colorizeStatus(res.statusCode)} - ${duration}ms`;

    if (hasBody) {
      const safeBody = redactData(req.body);
      logMessage += ` | Body: ${JSON.stringify(safeBody)}`;
    }

    // eslint-disable-next-line no-console
    console.log(sanitizeForLog(logMessage));
  });

  next();
}
