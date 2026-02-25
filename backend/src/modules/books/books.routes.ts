import "./books.doc";

import { container, injectable } from "tsyringe";
import { BookController } from "./books.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { bookQueryDto } from "./dtos/book-query.dto";
import { bookParamsDto } from "./dtos/book-params";
import { BookReviewsRoutes } from "./book-reviews.routes";

@injectable()
export class BookRoutes {
  private readonly controller: BookController;
  private readonly router: Router;
  private readonly bookReviewsRoutes = container.resolve(BookReviewsRoutes);

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

    this.router.use("/", this.bookReviewsRoutes.routes);

    this.router.get(
      "/:id",
      validateMiddleware({ params: bookParamsDto }),
      this.controller.findById,
    );
  }

  get routes() {
    return this.router;
  }
}
