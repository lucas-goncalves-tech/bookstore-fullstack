import { UserPayload } from "../shared/secutiry/token.service";

declare global {
  namespace Express {
    interface Request {
      safeBody?: unknown;
      safeParams?: unknown;
      safeQuery?: unknown;
      user?: UserPayload;
    }
  }
}

export {};
