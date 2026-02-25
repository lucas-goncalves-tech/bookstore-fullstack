import { describe, expect, it } from "vitest";
import { req } from "../../../tests/helpers/commom.helper";
import { Review } from "@prisma/client";
import { createBook } from "../../../tests/factories/book.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import { createReview } from "../../../tests/factories/review.factory";
import { prisma_test } from "../../../tests/setup";

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
      const review = await createReview();

      const { body } = await req
        .get(`${BASE_URL}/${review.bookId}/reviews`)
        .expect(200);

      expect(body.reviews).toHaveLength(1);
      expect(body.reviews).toEqual(
        expect.arrayContaining([expectedReviewShape()]),
      );
    });

    it("returns empty array when user has not reviewed the book", async () => {
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
});
