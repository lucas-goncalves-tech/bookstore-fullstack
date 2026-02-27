import {
  notFoundResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { meResponse } from "./dtos/user.dto";
import {
  findManyOrdersResponse,
  findOrderByIdResponse,
} from "../orders/dtos/orders.dto";
import { findManyByUserIdResponse } from "../reviews/dtos/reviews.dto";

registry.registerPath({
  method: "get",
  path: "/users/me",
  security: [{ cookieAuth: [] }],
  tags: ["Users"],
  summary: "Obter dados do usuário logado",
  responses: {
    200: {
      description: "Dados do usuário retornados com sucesso",
      content: {
        "application/json": {
          schema: meResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/users/me/orders",
  security: [{ cookieAuth: [] }],
  tags: ["Users"],
  summary: "Listar pedidos do usuário",
  responses: {
    200: {
      description: "Lista de pedidos",
      content: {
        "application/json": {
          schema: findManyOrdersResponse,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/users/me/orders/{id}",
  security: [{ cookieAuth: [] }],
  tags: ["Users"],
  summary: "Buscar pedido por ID",
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
      description: "Pedido encontrado",
      content: {
        "application/json": {
          schema: findOrderByIdResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/users/me/reviews",
  security: [{ cookieAuth: [] }],
  tags: ["Users"],
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
