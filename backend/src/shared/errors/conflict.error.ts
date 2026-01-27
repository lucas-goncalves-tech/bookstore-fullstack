import { BaseError } from "./base.error";

export class ConflictError extends BaseError {
  constructor(message = "Recurso já existe") {
    super(message, 409);
  }
}
