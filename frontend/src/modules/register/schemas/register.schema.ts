import {
  zodPassword,
  zodSafeEmail,
  zodSafeString,
} from "@/validators/zod.validators";
import { z } from "zod";

export const registerResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(["USER", "ADMIN"]),
  }),
});

export const registerSchema = z
  .object({
    name: zodSafeString
      .min(3, "Nome deve conter no minimo 3 caracteres")
      .max(56, "Nome deve conter no máximo 56 caracteres"),
    email: zodSafeEmail,
    password: zodPassword(),
    confirmPassword: zodPassword("Confirmar senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
