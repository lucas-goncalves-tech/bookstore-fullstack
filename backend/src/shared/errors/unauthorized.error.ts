import { BaseError } from "./base.error";

export class UnauthorizedError extends BaseError {
  constructor(message = "Acesso não autorizado") {
    super(message, 401);
  }
}
