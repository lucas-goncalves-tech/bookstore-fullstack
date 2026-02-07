import { Review } from "@prisma/client";

export type ICreateReviewInput = Pick<Review, "rating" | "comment">;
