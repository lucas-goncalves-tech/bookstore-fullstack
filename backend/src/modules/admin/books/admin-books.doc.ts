import {
  badRequestResponse,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import {
  createBookDto,
  createBookResponse,
  uploadBookCoverResponse,
  updateBookDto,
  updateBookResponse,
  findManyBooksReponse,
} from "../../books/dtos/books.dto";

registry.registerPath({
  method: "get",
  path: "/admin/books",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Listar livros (Admin)",
  description:
    "Retorna a lista de todos os livros no sistema. Opcionalmente, pode-se usar paginação e filtros. Diferente da rota pública, esta rota retorna também os livros sem estoque (stock = 0) e os livros deletados logicamente (onde `deletedAt` não é nulo).",
  parameters: [
    {
      name: "limit",
      in: "query",
      required: false,
      schema: {
        type: "integer",
      },
    },
    {
      name: "page",
      in: "query",
      required: false,
      schema: {
        type: "integer",
      },
    },
    {
      name: "search",
      in: "query",
      required: false,
      schema: {
        type: "string",
      },
    },
    {
      name: "categorySlug",
      in: "query",
      required: false,
      schema: {
        type: "string",
      },
    },
    {
      name: "minPrice",
      in: "query",
      required: false,
      schema: {
        type: "integer",
      },
    },
    {
      name: "maxPrice",
      in: "query",
      required: false,
      schema: {
        type: "integer",
      },
    },
  ],
  responses: {
    200: {
      description: "Livros listados com sucesso",
      content: {
        "application/json": {
          schema: findManyBooksReponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/admin/books",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Criar livro",
  description: "Cria um novo livro.",
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
          schema: createBookResponse,
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
  path: "/admin/books/{id}/cover",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Upload de capa de livro",
  description: "Upload de capa de livro.",
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
          schema: uploadBookCoverResponse,
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
  path: "/admin/books/{id}",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Atualizar livro",
  description: "Atualiza um livro do sistema.",
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
          schema: updateBookResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "patch",
  path: "/admin/books/{id}/restore",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Reativar livro",
  description: "Reativa um livro do sistema.",
  responses: {
    204: {
      description: "Livro reativado com sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/admin/books/{id}",
  tags: ["Admin - Books"],
  security: [{ cookieAuth: [] }],
  summary: "Deletar livro",
  description: "Remove um livro do sistema.",
  responses: {
    204: {
      description: "Livro deletado com sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
