import { BaseError } from "./base.error";

export class ForbiddenError extends BaseError {
  constructor(message = "Acesso não autorizado") {
    super(message, 403);
  }
}
