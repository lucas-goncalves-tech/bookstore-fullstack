import { z } from "zod";
import { zodPassword } from "../../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../../shared/validators/string.validator";
import { zodSafeEmail } from "../../../../shared/validators/email.validator";

export const adminCreateUserDto = z.object({
  email: zodSafeEmail,
  name: zodSafeString
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  password: zodPassword("Senha"),
  confirmPassword: zodPassword("Confirmar senha"),
  role: z.enum(["USER", "ADMIN"]),
});

export type AdminCreateUserDto = z.infer<typeof adminCreateUserDto>;

export const userResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  banReason: z.string().nullable(),
  bannedAt: z.date().nullable(),
});

export const metadataResponse = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const findManyUserForAdminResponse = z.object({
  data: z.array(userResponse),
  metadata: metadataResponse,
});

export const createUserforAdminResponse = z.object({
  message: z.string(),
  data: userResponse.omit({
    id: true,
  }),
});
