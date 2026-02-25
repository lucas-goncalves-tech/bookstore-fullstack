import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { DashboardRoutes } from "./dashboard/dashboard.routes";
import { AdminCategoriesRoutes } from "./categories/admin-categories.routes";
import { AdminBooksRoutes } from "./books/admin-books.routes";

@injectable()
export class AdminRoutes {
  private readonly router = Router();

  constructor(
    @inject(DashboardRoutes)
    private readonly dashboardRoutes: DashboardRoutes,
    @inject(AdminCategoriesRoutes)
    private readonly categoriesRoutes: AdminCategoriesRoutes,
    @inject(AdminBooksRoutes)
    private readonly booksRoutes: AdminBooksRoutes,
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(authMiddleware, adminOnlyMiddleware);
    this.router.use("/dashboard", this.dashboardRoutes.routes);
    this.router.use("/categories", this.categoriesRoutes.routes);
    this.router.use("/books", this.booksRoutes.routes);
  }

  get routes() {
    return this.router;
  }
}
