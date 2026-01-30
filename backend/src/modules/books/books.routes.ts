import { container, injectable } from "tsyringe";
import { BookController } from "./books.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { bookQueryDto } from "./dtos/book-query.dto";

@injectable()
export class BookRoutes {
  private readonly controller: BookController;
  private readonly router: Router;
  constructor() {
    this.controller = container.resolve(BookController);
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: bookQueryDto }),
      this.controller.findMany,
    );
  }

  get routes() {
    return this.router;
  }
}
