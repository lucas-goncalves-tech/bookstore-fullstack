import z from "zod";

export const zodPassword = (typeMessage = "Senha") =>
  z
    .string()
    .min(8, `${typeMessage} deve conter no minimo 8 caracteres`)
    .max(56, `${typeMessage} deve conter no máximo 56 caracteres`);
