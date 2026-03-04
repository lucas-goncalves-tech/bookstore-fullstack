import {
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import { findManyReviewForAdminResponse } from "./dtos/admin-reviews-response.dto";

registry.registerPath({
  method: "get",
  path: "/admin/reviews",
  tags: ["Admin - Reviews"],
  summary: "Listar avaliações",
  description: "Endpoint para listar avaliações de livros",
  parameters: [
    {
      name: "page",
      in: "query",
      required: false,
      description: "Número da página",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      description: "Limite de avaliações por página",
    },
    {
      name: "order",
      in: "query",
      required: false,
      description: "Ordem de ordenação por data de criação",
    },
    {
      name: "search",
      in: "query",
      required: false,
      description: "Busca por nome de usuário, email ou título do livro",
    },
  ],
  responses: {
    200: {
      description: "Lista de avaliações",
      content: {
        "application/json": {
          schema: findManyReviewForAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
