import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { generateOpenAPISpec } from "../docs/openapi.generator";
import { apiReference } from "@scalar/express-api-reference";

import "../modules/auth/auth.doc";

@injectable()
export class Routes {
  private router: Router;
  constructor(@inject(AuthRoutes) private readonly authRoutes: AuthRoutes) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use(
      "/api-doc",
      apiReference({
        theme: "deepSpace",
        content: generateOpenAPISpec(),
      }),
    );
    this.router.get("/health", (_req, res) => res.json({ message: "OK" }));
    this.router.use("/api/v1/auth", this.authRoutes.routes);

    // not found
    this.router.use((req, res) => {
      const method = req.method;
      const url = req.url;
      res
        .status(404)
        .json({ message: `Método ${method} não encontrado para ${url}` });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
