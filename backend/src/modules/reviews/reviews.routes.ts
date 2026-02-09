import { Router } from "express";
import { container, injectable } from "tsyringe";
import { ReviewController } from "./reviews.controlle";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

@injectable()
export class ReviewsRoutes {
  private readonly router = Router();
  private readonly reviewController = container.resolve(ReviewController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      this.reviewController.findManyByUserId,
    );
  }

  get routes() {
    return this.router;
  }
}
