import {
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import {
  adminCreateUserDto,
  createUserforAdminResponse,
  findManyUserForAdminResponse,
} from "./dtos/admin-users.dto";

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

registry.registerPath({
  method: "post",
  path: "/admin/users",
  tags: ["Admin - Users"],
  summary: "Criar usuário",
  description: "Endpoint para criar usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: adminCreateUserDto,
          example: {
            email: "John_Doe22@email.com",
            name: "John Doe 22",
            password: "123123123",
            confirmPassword: "123123123",
            role: "USER",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Usuário criado",
      content: {
        "application/json": {
          schema: createUserforAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
