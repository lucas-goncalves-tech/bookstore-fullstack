import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import {
  createReviewDto,
  createReviewResponseSchema,
} from "../reviews/dtos/review.dto";

registry.registerPath({
  method: "get",
  path: "/books/{id}/reviews",
  tags: ["Books"],
  summary: "Buscar avaliações de um livro",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  responses: {
    200: {
      description: "Avaliações do livro encontradas com sucesso",
    },
    ...badRequestResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/books/{id}/reviews",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Criar avaliação de um livro",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createReviewDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Avaliação do livro criada com sucesso",
      content: {
        "application/json": {
          schema: createReviewResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});
