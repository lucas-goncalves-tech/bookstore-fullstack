import { container, injectable } from "tsyringe";
import { AdminReviewsController } from "./admin-reviews.controller";
import { Router } from "express";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { findManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";

@injectable()
export class AdminReviewsRoutes {
  private readonly controller = container.resolve(AdminReviewsController);
  private readonly router = Router();
  constructor() {
    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: findManyForAdminReviewsQueryDto }),
      this.controller.findMany,
    );
  }
  get routes() {
    return this.router;
  }
}
