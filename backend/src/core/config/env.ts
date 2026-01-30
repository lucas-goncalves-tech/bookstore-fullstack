import z from "zod";

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
});

export const env = checkEnv.parse(process.env);
