import { describe, expect, it } from "vitest";
import { req } from "../../../tests/helpers/commom.helper";
import { Review } from "@prisma/client";
import { createBook } from "../../../tests/factories/book.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import { createReview } from "../../../tests/factories/review.factory";
import { prisma_test } from "../../../tests/setup";
import { createUser } from "../../../tests/factories/user.factory";

describe("BookReviewsIntegration", () => {
  const BASE_URL = "/api/v1/books";

  function expectedReviewShape() {
    return {
      id: expect.any(String),
      rating: expect.any(Number),
      comment: expect.any(String),
      bookId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      user: {
        name: expect.any(String),
      },
    };
  }

  function generateReviewData(overrides?: Partial<Review>) {
    return {
      rating: 5,
      comment: "Great book!",
      ...overrides,
    };
  }

  describe(`GET ${BASE_URL}/:id/reviews`, () => {
    it("returns all reviews from a book", async () => {
      const rating = 5;
      const comment = "Great book!";
      const review = await createReview({
        rating,
        comment,
      });

      const { body } = await req
        .get(`${BASE_URL}/${review.bookId}/reviews`)
        .expect(200);

      expect(body.reviews).toHaveLength(1);
      expect(body.reviews).toEqual(
        expect.arrayContaining([expectedReviewShape()]),
      );
      expect(body.averageRating).toBe(rating);
      expect(body.totalReviews).toBe(1);
    });

    it("returns all reviews from a book with pagination", async () => {
      const book = await createBook();
      const rating = 5;
      for (let i = 1; i <= 15; i++) {
        const user = await createUser();
        await createReview({ userId: user.id, bookId: book.id, rating });
      }

      const { body } = await req
        .get(`${BASE_URL}/${book.id}/reviews?page=1&limit=5`)
        .expect(200);

      expect(body.reviews).toHaveLength(5);
      expect(body.reviews).toEqual(
        expect.arrayContaining([expectedReviewShape()]),
      );
      expect(body.averageRating).toBe(rating);
      expect(body.totalReviews).toBe(15);
      expect(body.metadata).toEqual({
        page: 1,
        limit: 5,
        total: 15,
        totalPages: 3,
      });
    });

    it("return empty array when page is greater than total pages", async () => {
      const book = await createBook();
      for (let i = 1; i <= 5; i++) {
        const user = await createUser();
        await createReview({ userId: user.id, bookId: book.id });
      }

      const { body } = await req
        .get(`${BASE_URL}/${book.id}/reviews?page=3&limit=3`)
        .expect(200);

      expect(body.reviews).toEqual([]);
      expect(body.metadata).toEqual({
        page: 3,
        limit: 3,
        total: 5,
        totalPages: 2,
      });
    });

    it("returns empty array when book has no reviews", async () => {
      const book = await createBook();
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .get(`${BASE_URL}/${book.id}/reviews`)
        .expect(200);

      expect(body.reviews).toEqual([]);
    });

    it("returns 404 when book ID does not exist", async () => {
      const UUID = crypto.randomUUID();
      const { body } = await req
        .get(BASE_URL + "/" + UUID + "/reviews")
        .expect(404);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`GET ${BASE_URL}/:id/reviews/me`, () => {
    it("returns null when user has not reviewed the book", async () => {
      const book = await createBook();
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .get(`${BASE_URL}/${book.id}/reviews/me`)
        .expect(200);

      expect(body).toBeNull();
    });

    it("returns the review when user has reviewed the book", async () => {
      const { reqAgent, user } = await loginWithUser("user");
      const book = await createBook();
      const rating = 4;
      const comment = "Very good!";
      const review = await createReview({
        bookId: book.id,
        userId: user.id,
        rating,
        comment,
      });

      const { body } = await reqAgent
        .get(`${BASE_URL}/${book.id}/reviews/me`)
        .expect(200);

      expect(body).toMatchObject({
        id: review.id,
        rating,
        comment,
        bookId: book.id,
      });
      expect(body).not.toHaveProperty("userId");
    });

    it("returns 401 when user is not authenticated", async () => {
      const { body } = await req
        .get(`${BASE_URL}/invalid-uuid/reviews/me`)
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("returns 404 when book does not exist", async () => {
      const { reqAgent } = await loginWithUser("user");
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .get(`${BASE_URL}/${UUID}/reviews/me`)
        .expect(404);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`POST ${BASE_URL}/:id/reviews`, () => {
    it("creates a review when user is authenticated", async () => {
      const book = await createBook();
      const { reqAgent } = await loginWithUser("user");
      const review = generateReviewData();

      const { body } = await reqAgent
        .post(`${BASE_URL}/${book.id}/reviews`)
        .send(review)
        .expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        id: expect.any(String),
        rating: expect.any(Number),
        comment: expect.any(String),
        bookId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      const reviewFromDb = await prisma_test.review.findUnique({
        where: {
          id: body.data.id,
        },
      });
      expect(reviewFromDb).toBeTruthy();
      expect(reviewFromDb?.rating).toEqual(review.rating);
      expect(reviewFromDb?.comment).toEqual(review.comment);
      expect(reviewFromDb?.bookId).toEqual(book.id);
    });

    it("returns 400 when body is invalid", async () => {
      const book = await createBook();
      const { reqAgent } = await loginWithUser("user");
      const review = generateReviewData({
        rating: 6,
        comment: "",
      });

      const { body } = await reqAgent
        .post(`${BASE_URL}/${book.id}/reviews`)
        .send(review)
        .expect(400);
      const errors = body.errors.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("rating");
      expect(errors).toContain("comment");
    });

    it("returns 401 when user is not authenticated", async () => {
      const book = await createBook();
      const review = generateReviewData();

      const { body } = await req
        .post(`${BASE_URL}/${book.id}/reviews`)
        .send(review)
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("returns 404 when book does not exist", async () => {
      const { reqAgent } = await loginWithUser("user");
      const review = generateReviewData();
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .post(`${BASE_URL}/${UUID}/reviews`)
        .send(review)
        .expect(404);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`DELETE ${BASE_URL}/:id/reviews`, () => {
    it("deletes a review when user is authenticated", async () => {
      const { reqAgent, user } = await loginWithUser("user");
      const book = await createBook();
      const review = await createReview({
        bookId: book.id,
        userId: user.id,
      });

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${book.id}/reviews`)
        .expect(204);

      expect(body).toEqual({});

      const reviewFromDb = await prisma_test.review.findUnique({
        where: {
          id: review.id,
        },
      });
      expect(reviewFromDb).toBeFalsy();
    });

    it("returns 401 when user is not authenticated", async () => {
      const { body } = await req
        .delete(`${BASE_URL}/invalid-uuid/reviews`)
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("returns 404 when book does not exist", async () => {
      const { reqAgent } = await loginWithUser("user");
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${UUID}/reviews`)
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("returns 404 when review does not exist", async () => {
      const book = await createBook();
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${book.id}/reviews`)
        .expect(404);

      expect(body).toHaveProperty("message");
    });
  });
});
