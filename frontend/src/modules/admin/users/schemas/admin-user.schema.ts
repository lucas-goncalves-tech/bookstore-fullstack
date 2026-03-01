import { z } from "zod";

export const adminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
  banReason: z.string().nullable(),
  bannedAt: z.string().nullable(), // API typically returns dates as ISO strings
});

export type AdminUser = z.infer<typeof adminUserSchema>;

export const metadataSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Metadata = z.infer<typeof metadataSchema>;

export const adminUsersResponseSchema = z.object({
  data: z.array(adminUserSchema),
  metadata: metadataSchema,
});

export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>;
