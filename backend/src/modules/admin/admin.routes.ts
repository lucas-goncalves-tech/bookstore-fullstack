import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { DashboardRoutes } from "./dashboard/dashboard.routes";

@injectable()
export class AdminRoutes {
  private readonly router = Router();

  constructor(
    @inject(DashboardRoutes)
    private readonly dashboardRoutes: DashboardRoutes,
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(authMiddleware, adminOnlyMiddleware);
    this.router.use("/dashboard", this.dashboardRoutes.routes);
  }

  get routes() {
    return this.router;
  }
}
