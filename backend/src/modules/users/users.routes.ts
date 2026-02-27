import "./users.doc";

import { Router } from "express";
import { container } from "tsyringe";
import { UsersController } from "./users.controller";
import { OrderController } from "../orders/orders.controller";
import { ReviewController } from "../reviews/reviews.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { orderParamsDto } from "../orders/dtos/orders-params.dto";

export class UsersRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(UsersController);
  private readonly orderController = container.resolve(OrderController);
  private readonly reviewController = container.resolve(ReviewController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/me", authMiddleware, this.controller.me);
    this.router.get(
      "/me/orders",
      authMiddleware,
      this.orderController.findMany,
    );
    this.router.get(
      "/me/orders/:id",
      authMiddleware,
      validateMiddleware({ params: orderParamsDto }),
      this.orderController.findById,
    );
    this.router.get(
      "/me/reviews",
      authMiddleware,
      this.reviewController.findManyByUserId,
    );
  }

  get routes() {
    return this.router;
  }
}
