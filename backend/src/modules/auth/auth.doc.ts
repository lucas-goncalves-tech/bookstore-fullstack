import { registry } from "../../docs/openapi.registry";
import { createUserDto } from "./dto/create-user.dto";
import { registerResponseDto } from "./dto/response.dto";

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
  },
});
