import { BaseError } from "./base.error";

export class SessionError extends BaseError {
  constructor(message = "Sessão inválida") {
    super(message, 401);
  }
}
