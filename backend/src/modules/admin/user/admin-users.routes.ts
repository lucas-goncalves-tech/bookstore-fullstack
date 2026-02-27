import "./admin-users.doc";

import { container, injectable } from "tsyringe";
import { AdminUsersController } from "./admin-users.controller";
import { Router } from "express";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { findManyForAdminQueryDto } from "./dtos/admin-users.dto";

@injectable()
export class AdminUsersRoutes {
  private readonly controller = container.resolve(AdminUsersController);
  private readonly router = Router();
  constructor() {
    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: findManyForAdminQueryDto }),
      this.controller.findManyforAdmin,
    );
  }
  get routes() {
    return this.router;
  }
}
