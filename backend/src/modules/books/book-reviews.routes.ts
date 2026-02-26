import "./book-reviews.doc";

import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BookReviewsController } from "./book-reviews.controller";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { bookParamsDto } from "./dtos/book-params";
import { createReviewDto } from "../reviews/dtos/review.dto";
import { bookReviewsQueryDto } from "./dtos/book-query.dto";

@injectable()
export class BookReviewsRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(BookReviewsController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/:id/reviews",
      validateMiddleware({ query: bookReviewsQueryDto, params: bookParamsDto }),
      this.controller.findReviewsByBookId,
    );

    this.router.post(
      "/:id/reviews",
      authMiddleware,
      validateMiddleware({ params: bookParamsDto, body: createReviewDto }),
      this.controller.createReview,
    );

    this.router.delete(
      "/:id/reviews",
      authMiddleware,
      validateMiddleware({ params: bookParamsDto }),
      this.controller.deleteReview,
    );
  }

  get routes() {
    return this.router;
  }
}
