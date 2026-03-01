import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../shared/validators/string.validator";

export const createReviewDto = z.strictObject({
  rating: zodCoerceNumber
    .min(1, "Rating deve ser maior ou igual a 1")
    .max(5, "Rating deve ser menor ou igual a 5"),
  comment: zodSafeString
    .min(1, "Comentário deve ter pelo menos 1 caractere")
    .max(1000, "Comentário deve ter no máximo 1000 caracteres"),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;

const review = z.object({
  id: z.uuid(),
  bookId: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  user: z.object({
    name: z.string(),
  }),
});

export const createReviewResponseSchema = z.object({
  message: z.string(),
  data: review.omit({ user: true }),
});

export const listReviewsResponse = z.object({
  reviews: z.array(review),
  averageRating: z.number(),
  totalReviews: z.number(),
});

export const userReviewSchema = z.object({
  id: z.uuid(),
  bookId: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  book: z.object({
    title: z.string(),
    category: z
      .object({
        name: z.string(),
      })
      .nullable(),
    coverUrl: z.string().nullable(),
    author: z.string(),
  }),
});

export const findManyByUserIdResponse = z.object({
  reviews: z.array(userReviewSchema),
  averageRating: z.number(),
  totalReviews: z.number(),
});

export type UserReviewSchema = z.infer<typeof userReviewSchema>;

export const findMyReviewResponse = z
  .object({
    id: z.uuid(),
    bookId: z.uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
  })
  .nullable();
