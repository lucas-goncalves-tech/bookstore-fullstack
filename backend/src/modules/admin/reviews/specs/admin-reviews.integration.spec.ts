import { describe, expect, it } from "vitest";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import { createUser } from "../../../../tests/factories/user.factory";
import { createBook } from "../../../../tests/factories/book.factory";
import { createReview } from "../../../../tests/factories/review.factory";
import { req } from "../../../../tests/helpers/commom.helper";

describe("Admin Reviews Integration tests", () => {
  const BASE_URL = "/api/v1/admin/reviews";

  describe(`GET ${BASE_URL}`, () => {
    it("should return formatting review data correctly", async () => {
      const user = await createUser({ name: "John Doe", email: "johndoe@example.com" });
      const book = await createBook({ title: "Harry Potter", author: "J.K Roling", coverThumbUrl: "https://thumb.url" });
      await createReview({
        userId: user.id,
        bookId: book.id,
        rating: 5,
        comment: "Excellent read!",
      });

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent.get(BASE_URL).expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(1);

      const review = body.data[0];
      expect(review).toMatchObject({
        id: expect.any(String),
        rating: expect.any(Number),
        comment: expect.any(String),
        createdAt: expect.any(String),
        deletedAt: null,
      });
      expect(review.book).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        coverThumbUrl: expect.any(String),
        author: expect.any(String),
      });
      expect(review.user).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      });
    });

    it("should return reviews with pagination", async () => {
      for (let i = 0; i < 4; i++) {
        await createReview();
      }
      const page = 1;
      const limit = 2;

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ page, limit })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(2);
      expect(body.metadata).toMatchObject({
        page,
        limit,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it("should return reviews with search filter matching user email", async () => {
      const email = "findme@test.com";
      const user = await createUser({ email });
      await createReview({ userId: user.id });
      await createReview(); // random review to ensure filtering works

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: "findme" })
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].user.email).toBe(email);
    });

    it("should return reviews with search filter matching user name", async () => {
      const name = "Unique Name";
      const user = await createUser({ name });
      await createReview({ userId: user.id });
      await createReview();

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: "Unique" })
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].user.name).toBe(name);
    });

    it("should return reviews with search filter matching book title", async () => {
      const title = "Unique Book Title";
      const book = await createBook({ title });
      await createReview({ bookId: book.id });
      await createReview();

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: "Unique Book" })
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].book.title).toBe(title);
    });

    it("should return all reviews with orderBy desc", async () => {
      await createReview({ createdAt: new Date("2020-01-01") });
      await createReview({ createdAt: new Date("2021-01-01") });

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ order: "desc" })
        .expect(200);

      const first = new Date(body.data[0].createdAt);
      const second = new Date(body.data[1].createdAt);
      expect(first.getTime()).toBeGreaterThan(second.getTime());
    });

    it("should return all reviews with orderBy asc", async () => {
      await createReview({ createdAt: new Date("2020-01-01") });
      await createReview({ createdAt: new Date("2021-01-01") });

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ order: "asc" })
        .expect(200);

      const first = new Date(body.data[0].createdAt);
      const second = new Date(body.data[1].createdAt);
      expect(first.getTime()).toBeLessThan(second.getTime());
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");
      const { body } = await reqAgent.get(BASE_URL).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.get(BASE_URL).expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
