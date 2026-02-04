import { container, injectable } from "tsyringe";
import { OrderController } from "./orders.controller";
import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { createOrderDto } from "./dtos/orders.dto";

@injectable()
export class OrderRoutes {
  private readonly controller = container.resolve(OrderController);
  private readonly router = Router();
  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/",
      authMiddleware,
      validateMiddleware({ body: createOrderDto }),
      this.controller.createOrder,
    );
  }

  get routes() {
    return this.router;
  }
}
