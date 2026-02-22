import z from "zod";

export const meResponse = z.object({
  email: z.string(),
  name: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MeResponse = z.infer<typeof meResponse>;
