import { container, injectable } from "tsyringe";
import { BookController } from "./books.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { bookQueryDto } from "./dtos/book-query.dto";
import { createBookDto } from "./dtos/create-book.dto";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { bookParamsDto } from "./dtos/book-params";

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


    this.router.get(
      "/:id",
      validateMiddleware({ params: bookParamsDto }),
      this.controller.findById,
    );
    this.router.post("/", authMiddleware, adminOnlyMiddleware, validateMiddleware({ body: createBookDto }), this.controller.create);
  }

  get routes() {
    return this.router;
  }
}
