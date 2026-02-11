import {
  notFoundResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import z from "zod";

export const meResponseDto = z.object({
  email: z.string(),
  name: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MeResponseDto = z.infer<typeof meResponseDto>;

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
          schema: meResponseDto,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});
