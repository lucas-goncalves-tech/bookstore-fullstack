import { Review } from "@prisma/client";

export type ICreateReviewInput = Pick<Review, "rating" | "comment">;
export interface IQueryReviewInput {
  page?: number;
  limit?: number;
}
