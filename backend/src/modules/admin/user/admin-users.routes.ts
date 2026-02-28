import "./admin-users.doc";

import { container, injectable } from "tsyringe";
import { AdminUsersController } from "./admin-users.controller";
import { Router } from "express";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { findManyForAdminQueryDto } from "./dtos/admin-users-query.dto";
import {
  adminCreateUserDto,
  adminBanUserDto,
  adminUpdateUserDto,
} from "./dtos/admin-users.dto";
import { adminUserParamsDto } from "./dtos/admin-users-params.dto";

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
      this.controller.create,
    );
    this.router.put(
      "/:id",
      validateMiddleware({
        params: adminUserParamsDto,
        body: adminUpdateUserDto,
      }),
      this.controller.update,
    );
    this.router.patch(
      "/:id/restore",
      validateMiddleware({
        params: adminUserParamsDto,
      }),
      this.controller.restore,
    );
    this.router.delete(
      "/:id",
      validateMiddleware({
        params: adminUserParamsDto,
        body: adminBanUserDto,
      }),
      this.controller.ban,
    );
  }
  get routes() {
    return this.router;
  }
}
