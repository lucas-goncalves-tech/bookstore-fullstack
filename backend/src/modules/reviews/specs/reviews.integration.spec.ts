import { describe, it, expect } from "vitest";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import { createBook } from "../../../tests/factories/book.factory";
import { createReview } from "../../../tests/factories/review.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { UserReviewSchema } from "../dtos/reviews.dto";

describe("Review Integration Tests", () => {
  const BASE_URL = "/api/v1/users/me/reviews";

  const expectReviewShape: UserReviewSchema = {
    id: expect.any(String),
    bookId: expect.any(String),
    rating: expect.any(Number),
    comment: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    deletedAt: null,
    book: {
      title: expect.any(String),
      author: expect.any(String),
      coverUrl: null,
      category: null,
    },
  };

  describe(`GET ${BASE_URL}`, () => {
    it("should return all reviews made by user", async () => {
      const { reqAgent, user } = await loginWithUser();
      const ratingData = {
        rating: 5,
        comment: "Great book",
      };
      const book = await createBook();
      await createReview({
        userId: user.id,
        bookId: book.id,
        ...ratingData,
      });

      const { body } = await reqAgent.get(BASE_URL);

      expect(body.reviews).toHaveLength(1);
      expect(body.reviews[0]).toEqual(expectReviewShape);
      expect(body.reviews[0].rating).toBe(ratingData.rating);
      expect(body.reviews[0].comment).toBe(ratingData.comment);
      expect(body.reviews[0].book.title).toBe(book.title);
      expect(body.reviews[0].book.author).toBe(book.author);
    });

    it("should return 401 if user is not authenticated", async () => {
      const { body } = await req.get(BASE_URL).expect(401);
      expect(body).toHaveProperty("message");
    });
  });
});
