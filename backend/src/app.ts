import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { inject, singleton } from "tsyringe";
import { Routes } from "./core/routes";
import { errorHandler } from "./shared/middlewares/error-handler.middleware";
import { env } from "./core/config/env";
import cookieParser from "cookie-parser";
import { globalRateLimit } from "./shared/middlewares/rate-limit.middleware";

@singleton()
export class App {
  private readonly app: Express;
  constructor(
    @inject(Routes)
    private readonly routes: Routes,
  ) {
    this.app = express();
    this.middlewares();
    this.setupRoutes();
    this.errorHandling();
  }

  private middlewares() {
    this.app.set("trust proxy", 1);
    this.app.use(
      cors({
        origin:
          env.NODE_ENV === "production"
            ? env.ALLOWED_ORIGINS
            : ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      }),
    );
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
          },
        },
      }),
    );
    this.app.use(globalRateLimit);
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private setupRoutes() {
    this.app.use(this.routes.getRouter());
  }

  private errorHandling() {
    this.app.use(errorHandler);
  }

  public getServer(): Express {
    return this.app;
  }
}
