import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { AuthRoutes } from "../modules/auth/auth.routes";

import { BookRoutes } from "../modules/books/books.routes";
import { CategoriesRoutes } from "../modules/categories/categories.routes";
import { UsersRoutes } from "../modules/users/users.routes";
import { OrderRoutes } from "../modules/orders/orders.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";

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
    @inject(AdminRoutes)
    private readonly adminRoutes: AdminRoutes,
  ) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use("/auth", this.authRoutes.routes);
    this.router.use("/books", this.bookRoutes.routes);
    this.router.use("/categories", this.categoriesRoutes.routes);
    this.router.use("/users", this.usersRoutes.routes);
    this.router.use("/orders", this.orderRoutes.routes);
    this.router.use("/admin", this.adminRoutes.routes);

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
