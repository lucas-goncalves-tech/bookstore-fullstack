import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "A avaliação deve ser de pelo menos 1 estrela")
    .max(5, "A avaliação deve ser no máximo 5 estrelas"),
  comment: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(1000, "O comentário deve ter no máximo 1000 caracteres"),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;

export interface ReviewUser {
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookId: string;
  user: ReviewUser;
}

export interface BookReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
