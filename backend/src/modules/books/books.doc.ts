import {
  badRequestResponse,
  forbiddenResponse,
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
  uploadBookCoverResponseSchema,
  updateBookDto,
  updateBookResponseSchema,
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
  summary: "Criar livro (ADMIN)",
  description: "Cria um novo livro, apenas para administradores.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createBookDto,
          example: {
            title: "Book Title",
            author: "Book Author",
            description: "Book Description",
            price: 10.99,
            stock: 10,
            categoryId: null,
          },
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
    ...forbiddenResponse,
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

registry.registerPath({
  method: "post",
  path: "/books/{id}/cover",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Upload de capa de livro (ADMIN)",
  description: "Upload de capa de livro, apenas para administradores.",
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
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              cover: {
                type: "string",
                format: "binary",
              },
            },
            required: ["cover"],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Capa do livro enviada com sucesso",
      content: {
        "application/json": {
          schema: uploadBookCoverResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "put",
  path: "/books/{id}",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Atualizar livro (ADMIN)",
  description: "Atualiza um livro do sistema, apenas para administradores.",
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
          schema: updateBookDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Livro atualizado com sucesso",
      content: {
        "application/json": {
          schema: updateBookResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/books/{id}",
  tags: ["Books"],
  security: [{ cookieAuth: [] }],
  summary: "Deletar livro (ADMIN)",
  description: "Remove um livro do sistema, apenas para administradores.",
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
      description: "Livro deletado com sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
