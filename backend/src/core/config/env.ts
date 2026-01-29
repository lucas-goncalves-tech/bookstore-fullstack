import z from "zod";

const checkEnv = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  DATABASE_TEST_URL: z.string().optional(),
  SALT: z.coerce.number().default(10),
});

export const env = checkEnv.parse(process.env);
