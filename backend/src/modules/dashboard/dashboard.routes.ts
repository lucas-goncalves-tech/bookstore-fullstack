import { Router } from "express";
import { container, injectable } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { DashboardController } from "./dashboard.controller";

@injectable()
export class DashboardRoutes {
  private readonly controller = container.resolve(DashboardController);
  private readonly router = Router();
  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(authMiddleware, adminOnlyMiddleware);
    this.router.get("/details", this.controller.getOverviewMetrics);

    this.router.get("/sales", this.controller.getLastSales);
  }

  get routes() {
    return this.router;
  }
}
