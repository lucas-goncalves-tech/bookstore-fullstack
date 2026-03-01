import { z } from "zod";
import { zodPassword } from "@/validators/zod.validators";

const userBaseFormSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  role: z.enum(["USER", "ADMIN"]),
});

export const createUserFormSchema = userBaseFormSchema
  .extend({
    password: zodPassword("Senha"),
    confirmPassword: zodPassword("Confirmar senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const updateUserFormSchema = userBaseFormSchema;

export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

export const updateUserPasswordFormSchema = z
  .object({
    password: zodPassword("Nova senha"),
    confirmPassword: zodPassword("Confirmar nova senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UpdateUserPasswordFormValues = z.infer<
  typeof updateUserPasswordFormSchema
>;

export const banUserFormSchema = z.object({
  banReason: z
    .string()
    .min(10, "O motivo do banimento deve ter pelo menos 10 caracteres")
    .max(255, "O motivo do banimento deve ter no máximo 255 caracteres"),
});

export type BanUserFormValues = z.infer<typeof banUserFormSchema>;
