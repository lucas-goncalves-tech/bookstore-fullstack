import { z } from "zod";

export const userReviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
  bookId: z.string(),
  book: z.object({
    title: z.string(),
    author: z.string(),
    coverUrl: z.string().nullable(),
    category: z.object({ name: z.string() }).nullable(),
  }),
});

export const myReviewsResponseSchema = z.object({
  reviews: z.array(userReviewSchema),
  averageRating: z.number(),
  totalReviews: z.number(),
});

export type UserReview = z.infer<typeof userReviewSchema>;
export type MyReviewsResponse = z.infer<typeof myReviewsResponseSchema>;
