import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.registry";
import { env } from "../core/config/env";

export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Bookstore API",
      description: "API Bookstore documentada com Zod e Scalar",
    },
    servers: [
      {
        url: env.OPENAPI_URL || "http://api:3333/api/v1",
        description: "Hospedagem",
      },
      {
        url: "http://localhost:3333/api/v1",
        description: "Desenvolvimento Local",
      },
    ],
  });
}
