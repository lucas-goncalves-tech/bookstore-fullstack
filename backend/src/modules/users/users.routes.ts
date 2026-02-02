import { Router } from "express";
import { container } from "tsyringe";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

export class UsersRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(UsersController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/me", authMiddleware, this.controller.me);
  }

  get routes() {
    return this.router;
  }
}
