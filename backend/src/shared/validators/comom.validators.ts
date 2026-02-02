import z from "zod";
import { zodSafeString } from "./string.validator";

export const zodPassword = (typeMessage = "Senha") =>
  z
    .string()
    .min(8, `${typeMessage} deve conter no minimo 8 caracteres`)
    .max(56, `${typeMessage} deve conter no máximo 56 caracteres`);

export const zodCoerceNumber = z.coerce
  .number(`Campo deve ser um numero`)
  .nonnegative();

export const zodSafeSlug = zodSafeString.regex(/^[a-z0-9-]+$/);
