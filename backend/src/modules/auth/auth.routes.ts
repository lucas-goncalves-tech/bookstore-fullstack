import { container, injectable } from "tsyringe";
import { AuthController } from "./auth.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import {
  authRateLimit,
  registerRateLimit,
} from "../../shared/middlewares/rate-limit.middleware";
import { createUserDto, loginDto } from "./dto/auth.dto";

@injectable()
export class AuthRoutes {
  private readonly controller: AuthController;
  private readonly router: Router;
  constructor() {
    this.controller = container.resolve(AuthController);
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/register",
      registerRateLimit,
      validateMiddleware({ body: createUserDto }),
      this.controller.create,
    );
    this.router.post(
      "/login",
      authRateLimit,
      validateMiddleware({ body: loginDto }),
      this.controller.login,
    );

    this.router.get("/refresh", this.controller.refresh);

    this.router.get("/logout", authMiddleware, this.controller.logout);
  }

  get routes() {
    return this.router;
  }
}
