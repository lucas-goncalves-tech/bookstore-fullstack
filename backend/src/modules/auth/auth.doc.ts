import {
  badRequestResponse,
  conflictResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { createUserDto, loginDto, registerResponseDto } from "./dto/auth.dto";

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login de usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginDto,
          example: {
            email: "user@user.com",
            password: "123123123",
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: "Usuário logado com sucesso",
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Registrar novo usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserDto,
          example: {
            name: "User",
            email: "test@test.com",
            password: "123123123",
            confirmPassword: "123123123",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuário criado com sucesso",
      content: {
        "application/json": {
          schema: registerResponseDto,
        },
      },
    },
    ...badRequestResponse,
    ...conflictResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/refresh",
  security: [{ cookieAuth: [] }],
  tags: ["Auth"],
  summary: "Renovar token de autenticação",
  responses: {
    204: {
      description: "Token renovado com sucesso",
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/logout",
  security: [{ cookieAuth: [] }],
  tags: ["Auth"],
  summary: "Logout de usuário",
  responses: {
    204: {
      description: "Usuário deslogado com sucesso",
    },
    ...unauthorizedResponse,
  },
});
