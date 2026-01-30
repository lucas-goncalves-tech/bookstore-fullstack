import z from "zod";
import { zodSafeEmail } from "../../shared/validators/email.validator";
import { zodPassword } from "../../shared/validators/comom.validators";
import { zodSafeString } from "../../shared/validators/string.validator";

const checkEnv = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["test", "production", "development"]),
  DATABASE_URL: z.string(),
  DATABASE_TEST_URL: z.string().optional(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT SECRET deve conter no minimo 32 caracteres"),
  JWT_EXPIRES: z.string(),
  SALT: z.coerce.number().default(10),
  ADMIN_EMAIL: zodSafeEmail,
  ADMIN_PASSWORD: zodPassword(),
  ADMIN_NAME: zodSafeString.min(2),
});

export const env = checkEnv.parse(process.env);
