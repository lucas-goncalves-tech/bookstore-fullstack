import { ZodError } from "zod";

export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly errors?: unknown,
  ) {
    super(message);
    if (errors instanceof ZodError) {
      this.errors = errors.issues.map((issue) => ({
        [issue.path.join(".")]: issue.message,
      }));
    }
  }
}
