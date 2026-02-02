import { Router } from "express";
import { container } from "tsyringe";
import { CategoriesController } from "./categories.controller";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { createCategoryDto } from "./dtos/category.dto";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { categoryParamsDto } from "./dtos/category-params.dto";

export class CategoriesRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(CategoriesController);
  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", this.controller.findMany);
    this.router.post(
      "/",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({ body: createCategoryDto }),
      this.controller.create,
    );
    this.router.put(
      "/:id",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({
        body: createCategoryDto,
        params: categoryParamsDto,
      }),
      this.controller.update,
    );
  }

  get routes() {
    return this.router;
  }
}
