import z from "zod";

export const registerResponseDto = z.object({
  message: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(["ADMIN", "USER"]),
  }),
});

export type RegisterResponseDto = z.infer<typeof registerResponseDto>;
