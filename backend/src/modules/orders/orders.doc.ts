import {
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { createOrderDto, createOrderResponse } from "./dtos/orders.dto";

registry.registerPath({
  method: "post",
  path: "/orders",
  security: [{ cookieAuth: [] }],
  tags: ["Orders"],
  summary: "Criar novo pedido",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createOrderDto,
          example: [
            { id: "123e4567-e89b-12d3-a456-426614174000", quantity: 2 },
            { id: "223e4567-e89b-12d3-a456-426614174001", quantity: 1 },
          ],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Pedido criado com sucesso",
      content: {
        "application/json": {
          schema: createOrderResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...conflictResponse,
  },
});
