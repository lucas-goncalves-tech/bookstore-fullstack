import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { inject, singleton } from "tsyringe";
import { Routes } from "./core/routes";
import { errorHandler } from "./shared/middlewares/error-handler.middleware";

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
    this.app.use(express.json());
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
    this.app.use(cors());
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
