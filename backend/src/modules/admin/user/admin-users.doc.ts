import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import {
  adminCreateUserDto,
  adminBanUserDto,
  adminUpdateUserDto,
  createUserforAdminResponse,
  deleteUserforAdminResponse,
  findManyUserForAdminResponse,
  updateUserforAdminResponse,
  adminUpdateUserPasswordDto,
} from "./dtos/admin-users.dto";

registry.registerPath({
  method: "get",
  path: "/admin/users",
  tags: ["Admin - Users"],
  summary: "Listar usuários",
  description: "Endpoint para listar usuários",
  parameters: [
    {
      name: "page",
      in: "query",
      required: false,
      description: "Número da página",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      description: "Limite de usuários por página",
    },
    {
      name: "order",
      in: "query",
      required: false,
      description: "Ordem de ordenação",
    },
    {
      name: "search",
      in: "query",
      required: false,
      description: "Busca por nome ou email",
    },
  ],
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
    ...badRequestResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "put",
  path: "/admin/users/{id}",
  tags: ["Admin - Users"],
  summary: "Atualizar usuário",
  description: "Endpoint para atualizar usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: adminUpdateUserDto,
          example: {
            email: "John_DoeNew@email.com",
            name: "John Doe New",
            role: "ADMIN",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Usuário atualizado",
      content: {
        "application/json": {
          schema: updateUserforAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...badRequestResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "patch",
  path: "/admin/users/{id}/password",
  tags: ["Admin - Users"],
  summary: "Atualizar senha do usuário",
  description: "Endpoint para atualizar senha do usuário",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "ID do usuário",
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: adminUpdateUserPasswordDto,
          example: {
            password: "newPassword",
            confirmPassword: "newPassword",
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: "Senha do usuário atualizada",
    },
    ...unauthorizedResponse,
    ...badRequestResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "patch",
  path: "/admin/users/{id}/restore",
  tags: ["Admin - Users"],
  summary: "Desbane um usuário",
  description: "Endpoint para desbanir usuário",
  responses: {
    200: {
      description: "Usuário desbanido",
      content: {
        "application/json": {
          schema: updateUserforAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/admin/users/{id}",
  tags: ["Admin - Users"],
  summary: "Bane um usuário",
  description: "Endpoint para banir um usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: adminBanUserDto,
          example: {
            banReason: "test ban reason",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Usuário banido",
      content: {
        "application/json": {
          schema: deleteUserforAdminResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...badRequestResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/admin/users/{id}/permanent",
  tags: ["Admin - Users"],
  summary: "Deleta um usuário permanentemente",
  description: "Endpoint para deletar um usuário permanentemente",
  responses: {
    204: {
      description: "Usuário deletado",
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...forbiddenResponse,
  },
});
