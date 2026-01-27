import z from "zod";

const checkEnv = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  DATABASE_TEST_URL: z.string().optional(),
});

export const env = checkEnv.parse(process.env);
