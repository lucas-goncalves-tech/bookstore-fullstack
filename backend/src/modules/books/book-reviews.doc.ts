import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import {
  createReviewDto,
  createReviewResponseSchema,
  findMyReviewResponse,
} from "../reviews/dtos/reviews.dto";

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
  method: "get",
  path: "/books/{id}/reviews/me",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Buscar minha avaliação de um livro",
  description:
    "Retorna a avaliação do usuário autenticado para o livro informado. Retorna `null` caso o usuário ainda não tenha avaliado o livro.",
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
      description: "Avaliação do usuário encontrada (ou null se não avaliou)",
      content: {
        "application/json": {
          schema: findMyReviewResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/books/{id}/reviews",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Criar ou atualizar avaliação de um livro",
  description:
    "Cria uma nova avaliação para o livro. Caso o usuário já tenha avaliado o livro, a avaliação existente é atualizada (upsert).",
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

registry.registerPath({
  method: "delete",
  path: "/books/{id}/reviews",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Deletar minha avaliação de um livro",
  description:
    "Remove a avaliação do usuário autenticado para o livro informado. Retorna 404 caso o livro ou a avaliação não sejam encontrados.",
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
    204: {
      description: "Avaliação deletada com sucesso",
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});
