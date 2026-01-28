import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(message = "Dados inválidos", details?: unknown) {
    super(message, 400, details);
  }
}
