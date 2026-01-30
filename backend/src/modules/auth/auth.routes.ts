import { container, injectable } from "tsyringe";
import { AuthController } from "./auth.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { createUserDto } from "./dto/create-user.dto";
import { loginDto } from "./dto/login.dto";

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
      validateMiddleware({ body: createUserDto }),
      this.controller.create,
    );
    this.router.post(
      "/login",
      validateMiddleware({ body: loginDto }),
      this.controller.login,
    );
  }

  get routes() {
    return this.router;
  }
}
