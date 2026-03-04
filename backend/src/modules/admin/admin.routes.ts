import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { DashboardRoutes } from "./dashboard/dashboard.routes";
import { AdminCategoriesRoutes } from "./categories/admin-categories.routes";
import { AdminBooksRoutes } from "./books/admin-books.routes";
import { AdminUsersRoutes } from "./user/admin-users.routes";
import { AdminReviewsRoutes } from "./reviews/admin-reviews.routes";
import { nocacheMiddleware } from "../../shared/middlewares/nocache.middleware";

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
    @inject(AdminUsersRoutes)
    private readonly usersRoutes: AdminUsersRoutes,
    @inject(AdminReviewsRoutes)
    private readonly reviewsRoutes: AdminReviewsRoutes,
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(authMiddleware, adminOnlyMiddleware, nocacheMiddleware);
    this.router.use("/dashboard", this.dashboardRoutes.routes);
    this.router.use("/categories", this.categoriesRoutes.routes);
    this.router.use("/books", this.booksRoutes.routes);
    this.router.use("/users", this.usersRoutes.routes);
    this.router.use("/reviews", this.reviewsRoutes.routes);
  }

  get routes() {
    return this.router;
  }
}
