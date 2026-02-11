import z from "zod";
import { zodSafeEmail } from "../../../shared/validators/email.validator";
import { zodPassword } from "../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../shared/validators/string.validator";

export const createUserDto = z
  .strictObject({
    email: zodSafeEmail,
    name: zodSafeString
      .min(3, "Nome deve conter no minimo 3 caracteres")
      .max(56, "Nome deve conter no máximo 56 caracteres"),
    password: zodPassword(),
    confirmPassword: zodPassword("Confirmar senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginDto = z.strictObject({
  email: zodSafeEmail,
  password: zodPassword(),
});

export type LoginDTO = z.infer<typeof loginDto>;

export type CreateUserDto = z.infer<typeof createUserDto>;

export const registerResponseDto = z.object({
  message: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(["ADMIN", "USER"]),
  }),
});

export type RegisterResponseDto = z.infer<typeof registerResponseDto>;
