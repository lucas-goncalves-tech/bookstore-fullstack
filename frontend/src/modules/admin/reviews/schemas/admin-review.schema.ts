import { z } from "zod";

export const adminReviewUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const adminReviewBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverThumbUrl: z.string().nullable(),
  author: z.string(),
});

export const adminReviewSchema = z.object({
  id: z.string(),
  createdAt: z.string(), // API returns Date as ISO string
  deletedAt: z.string().nullable(),
  rating: z.number(),
  comment: z.string().nullable(),
  user: adminReviewUserSchema,
  book: adminReviewBookSchema,
});

export type AdminReview = z.infer<typeof adminReviewSchema>;

export const metadataSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Metadata = z.infer<typeof metadataSchema>;

export const adminReviewsResponseSchema = z.object({
  data: z.array(adminReviewSchema),
  metadata: metadataSchema,
});

export type AdminReviewsResponse = z.infer<typeof adminReviewsResponseSchema>;
