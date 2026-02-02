import { z } from "zod";

export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  createdAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;

export const usersResponseSchema = z.object({
  data: z.array(userSchema),
  meta: z
    .object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

export type UsersResponse = z.infer<typeof usersResponseSchema>;
