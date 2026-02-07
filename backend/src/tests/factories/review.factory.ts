import { Review } from "@prisma/client";
import { createBook } from "./book.factory";
import { prisma_test } from "../setup";
import { createUser } from "./user.factory";

export async function createReview(overrides?: Partial<Review>) {
  const book = await createBook();
  const user = await createUser();
  return await prisma_test.review.create({
    data: {
      rating: 5,
      comment: "Great book!",
      bookId: book.id,
      userId: user.id,
      ...overrides,
    },
  });
}
