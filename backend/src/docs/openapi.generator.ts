import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.registry";

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
        url: "http://localhost:3333/api/v1",
        description: "Desenvolvimento Local",
      },
      {
        url: "http://api:3333/api/v1",
        description: "Docker (interno)",
      },
    ],
  });
}
