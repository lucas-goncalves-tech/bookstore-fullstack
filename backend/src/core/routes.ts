import "../modules/auth/auth.doc";
import "../modules/books/books.doc";
import "../modules/categories/categories.doc";
import "../modules/orders/orders.doc";
import "../modules/reviews/review.doc";
import "../modules/dashboard/dashboard.doc";

import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { generateOpenAPISpec } from "../docs/openapi.generator";
import { apiReference } from "@scalar/express-api-reference";

import { BookRoutes } from "../modules/books/books.routes";
import { CategoriesRoutes } from "../modules/categories/categories.routes";
import { UsersRoutes } from "../modules/users/users.routes";
import { OrderRoutes } from "../modules/orders/orders.routes";
import { ReviewsRoutes } from "../modules/reviews/review.routes";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";

@injectable()
export class Routes {
  private router: Router;
  constructor(
    @inject(AuthRoutes) private readonly authRoutes: AuthRoutes,
    @inject(BookRoutes) private readonly bookRoutes: BookRoutes,
    @inject(CategoriesRoutes)
    private readonly categoriesRoutes: CategoriesRoutes,
    @inject(UsersRoutes)
    private readonly usersRoutes: UsersRoutes,
    @inject(OrderRoutes)
    private readonly orderRoutes: OrderRoutes,
    @inject(ReviewsRoutes)
    private readonly reviewsRoutes: ReviewsRoutes,
    @inject(DashboardRoutes)
    private readonly dashboardRoutes: DashboardRoutes,
  ) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use(
      "/api-docs",
      apiReference({
        theme: "deepSpace",
        content: generateOpenAPISpec(),
      }),
    );
    this.router.get("/health", (_req, res) => res.json({ message: "OK" }));
    this.router.use("/api/v1/auth", this.authRoutes.routes);
    this.router.use("/api/v1/books", this.bookRoutes.routes);
    this.router.use("/api/v1/categories", this.categoriesRoutes.routes);
    this.router.use("/api/v1/users", this.usersRoutes.routes);
    this.router.use("/api/v1/orders", this.orderRoutes.routes);
    this.router.use("/api/v1/reviews", this.reviewsRoutes.routes);
    this.router.use("/api/v1/dashboard", this.dashboardRoutes.routes);

    // not found
    this.router.use((req, res) => {
      const method = req.method;
      const url = req.url;
      res
        .status(404)
        .json({ message: `Método ${method} não encontrado para ${url}` });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
