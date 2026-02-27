import {
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import { findManyUserForAdminResponse } from "./dtos/admin-users.dto";

registry.registerPath({
  method: "get",
  path: "/admin/users",
  tags: ["Admin - Users"],
  summary: "Listar usuários",
  description: "Endpoint para listar usuários",
  responses: {
    200: {
      description: "Lista de usuários",
      content: {
        "application/json": {
          schema: findManyUserForAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
