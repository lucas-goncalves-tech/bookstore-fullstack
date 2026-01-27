import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(
    message = "Dados inválidos",
    details?: Record<string, string[]>[],
  ) {
    super(message, 400, details);
  }
}
