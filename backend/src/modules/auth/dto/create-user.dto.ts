import z from "zod";
import { zodSafeEmail } from "../../../shared/validators/email.validator";
import { zodSafeString } from "../../../shared/validators/string.validator";
import { zodPassword } from "../../../shared/validators/comom.validators";

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

export type CreateUserDto = z.infer<typeof createUserDto>;
