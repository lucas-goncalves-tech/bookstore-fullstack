import "./admin-users.doc";

import { container, injectable } from "tsyringe";
import { AdminUsersController } from "./admin-users.controller";
import { Router } from "express";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { findManyForAdminQueryDto } from "./dtos/admin-users-query.dto";
import { adminCreateUserDto } from "./dtos/admin-users.dto";

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
      this.controller.findMany,
    );
    this.router.post(
      "/",
      validateMiddleware({ body: adminCreateUserDto }),
      this.controller.createUser,
    );
  }
  get routes() {
    return this.router;
  }
}
