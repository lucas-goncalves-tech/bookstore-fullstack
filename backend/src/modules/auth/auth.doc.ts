import {
  badRequestResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import { createUserDto } from "./dto/create-user.dto";
import { loginDto } from "./dto/login.dto";
import { registerResponseDto } from "./dto/response.dto";

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
  },
});
