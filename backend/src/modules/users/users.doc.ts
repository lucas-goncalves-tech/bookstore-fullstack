import {
  notFoundResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { meResponse } from "./dtos/user.dto";

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
