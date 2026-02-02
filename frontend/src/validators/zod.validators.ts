import z from "zod";

export const HTML_UNSAFE_CHARS = /[<>"'`&]/;
export const INVISIBLE_CHARS = /\p{C}/u;

export const zodSafeString = z
  .string()
  .normalize("NFC")
  .trim()
  .refine(
    (value) => !HTML_UNSAFE_CHARS.test(value),
    "Campo contém caracteres HTML não permitidos",
  )
  .refine(
    (value) => !INVISIBLE_CHARS.test(value),
    "Campo contém caracteres invisíveis não permitidos",
  );

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

export const zodPassword = (typeMessage = "Senha") =>
  z
    .string()
    .min(8, `${typeMessage} deve conter no minimo 8 caracteres`)
    .max(56, `${typeMessage} deve conter no máximo 56 caracteres`);

export const zodSafeSlug = zodSafeString.regex(/^[a-z0-9-]+$/);

export const zodCoerceNumber = z.coerce
  .number(`Campo deve ser um numero`)
  .nonnegative();
