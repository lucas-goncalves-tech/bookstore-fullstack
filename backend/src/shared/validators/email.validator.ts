import z from "zod";
import { INVISIBLE_CHARS } from "./string.validator";

export const zodSafeEmail = z
  .email("Formato de email inválido")
  .normalize("NFC")
  .trim()
  .toLowerCase()
  .max(254, "Email excede o limite de 254 caracteres")
  .refine(
    (value) => !INVISIBLE_CHARS.test(value),
    "Email contém caracteres inválidos",
  );
