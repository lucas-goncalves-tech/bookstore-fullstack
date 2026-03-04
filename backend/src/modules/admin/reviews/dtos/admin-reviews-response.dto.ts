import { z } from "zod";

export const adminReviewResponse = z.object({
  id: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  rating: z.object({
    star: z.number(),
    comment: z.string().nullable(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  book: z.object({
    id: z.string(),
    title: z.string(),
    coverThumbUrl: z.string().nullable(),
    author: z.string(),
  }),
});

export const metadataResponse = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const findManyReviewForAdminResponse = z.object({
  data: z.array(adminReviewResponse),
  metadata: metadataResponse,
});
