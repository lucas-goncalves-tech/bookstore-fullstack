import "./admin-categories.doc";

import { Router } from "express";
import { container, injectable } from "tsyringe";
import { CategoriesController } from "../../categories/categories.controller";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { createCategoryDto } from "../../categories/dtos/category.dto";
import { categoryParamsDto } from "../../categories/dtos/category-params.dto";

@injectable()
export class AdminCategoriesRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(CategoriesController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/",
      validateMiddleware({ body: createCategoryDto }),
      this.controller.create,
    );
    this.router.put(
      "/:id",
      validateMiddleware({
        body: createCategoryDto,
        params: categoryParamsDto,
      }),
      this.controller.update,
    );
    this.router.delete(
      "/:id",
      validateMiddleware({ params: categoryParamsDto }),
      this.controller.delete,
    );
  }

  get routes() {
    return this.router;
  }
}
