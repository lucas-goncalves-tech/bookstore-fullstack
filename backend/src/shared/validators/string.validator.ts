import z from "zod";

export const HTML_UNSAFE_CHARS = /[<>"'`&]/;
export const INVISIBLE_CHARS = /\p{C}/u;

export const zodSafeString = z
  .string()
  .normalize("NFC")
  .trim()
  .refine(
    (value) => !HTML_UNSAFE_CHARS.test(value),
    "Campo contém caracteres HTML",
  )
  .refine(
    (value) => !INVISIBLE_CHARS.test(value),
    "Campo contém caracteres non-ASCII",
  );
