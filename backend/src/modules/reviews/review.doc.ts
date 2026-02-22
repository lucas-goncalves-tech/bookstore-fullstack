import { unauthorizedResponse } from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { findManyByUserIdResponse } from "./dtos/review.dto";

registry.registerPath({
  method: "get",
  path: "/reviews",
  security: [{ cookieAuth: [] }],
  tags: ["Reviews"],
  summary: "Listar avaliações do usuário",
  description:
    "Retorna todas as avaliações feitas pelo usuário autenticado, incluindo estatísticas.",
  responses: {
    200: {
      description: "Avaliações do usuário listadas com sucesso",
      content: {
        "application/json": {
          schema: findManyByUserIdResponse,
        },
      },
    },
    ...unauthorizedResponse,
  },
});
