import { Router } from "express";
import { container } from "tsyringe";
import { CategoriesController } from "./categories.controller";

export class CategoriesRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(CategoriesController);
  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", this.controller.findMany);
  }

  get routes() {
    return this.router;
  }
}
