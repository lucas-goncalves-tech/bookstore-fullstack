import z from "zod";

export const badRequest = z.object({
  message: z.string(),
  errors: z.array(z.record(z.string(), z.string())),
});

export const commomError = z.object({
  message: z.string(),
});

export const badRequestResponse = {
  400: {
    description: "Campos inválidos",
    content: { "application/json": { schema: badRequest } },
  },
};

export const unauthorizedResponse = {
  401: {
    description: "Não autorizado",
    content: { "application/json": { schema: commomError } },
  },
};

export const forbiddenResponse = {
  403: {
    description: "Acesso negado. Requer permissão de ADMIN",
    content: {
      "application/json": {
        schema: commomError,
        example: { message: "Acesso negado" },
      },
    },
  },
};

export const notFoundResponse = {
  404: {
    description: "Não encontrado",
    content: { "application/json": { schema: commomError } },
  },
};

export const conflictResponse = {
  409: {
    description: "Conflito de recursos",
    content: { "application/json": { schema: commomError } },
  },
};
