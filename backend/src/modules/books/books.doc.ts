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
import {
  booksResponseSchema,
  bookResponseSchema,
  createBookDto,
  createBookResponseSchema,
} from "./dtos/book.dto";

registry.registerPath({
  method: "get",
  path: "/books",
  tags: ["Books"],
  summary: "Listar livros",
  responses: {
    200: {
      description: "Livros listados com sucesso",
      content: {
        "application/json": {
          schema: booksResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/books/{id}",
  tags: ["Books"],
  summary: "Buscar livro por ID",
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
      description: "Livro encontrado com sucesso",
      content: {
        "application/json": {
          schema: bookResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...notFoundResponse,
  },
});

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
  path: "/books",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Criar livro",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createBookDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Livro criado com sucesso",
      content: {
        "application/json": {
          schema: createBookResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
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
