import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { inject, singleton } from "tsyringe";
import { Routes } from "./core/routes";
import { errorHandler } from "./shared/middlewares/error-handler.middleware";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware";
import { env } from "./core/config/env";
import cookieParser from "cookie-parser";
import { globalRateLimit } from "./shared/middlewares/rate-limit.middleware";
import { apiReference } from "@scalar/express-api-reference";
import { generateOpenAPISpec } from "./docs/openapi.generator";
import { CleanupExpiredSessionsJob } from "./shared/jobs/cleanup-expired-sessions.job";

@singleton()
export class App {
  private readonly app: Express;

  constructor(
    @inject(Routes)
    private readonly routes: Routes,
    @inject(CleanupExpiredSessionsJob)
    private readonly cleanupExpiredSessionsJob: CleanupExpiredSessionsJob,
  ) {
    this.app = express();
    this.docs();
    this.middlewares();
    this.setupRoutes();
    this.errorHandling();
    this.jobs();
  }

  private docs() {
    this.app.get("/health", (_req, res) => res.json({ message: "OK" }));
    this.app.use(
      "/api-docs",
      apiReference({
        theme: "deepSpace",
        content: generateOpenAPISpec(),
      }),
    );
  }

  private middlewares() {
    this.app.set("trust proxy", 1);
    this.app.use(loggerMiddleware);
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
    this.app.use(helmet());
    this.app.use(globalRateLimit);
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private setupRoutes() {
    this.app.use("/api/v1", this.routes.getRouter());
  }

  private errorHandling() {
    this.app.use(errorHandler);
  }

  private jobs() {
    this.cleanupExpiredSessionsJob.start();
  }

  public getServer(): Express {
    return this.app;
  }
}
