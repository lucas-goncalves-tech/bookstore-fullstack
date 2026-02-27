import { badRequestResponse, notFoundResponse } from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";

import { findManyBooksReponse, findBookByIdResponse } from "./dtos/books.dto";

registry.registerPath({
  method: "get",
  path: "/books",
  tags: ["Books"],
  summary: "Listar livros",
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
          schema: findBookByIdResponse,
        },
      },
    },
    ...badRequestResponse,
    ...notFoundResponse,
  },
});
