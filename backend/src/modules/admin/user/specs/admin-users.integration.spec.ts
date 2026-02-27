import { describe, expect, it } from "vitest";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import { createUser } from "../../../../tests/factories/user.factory";
import { req } from "../../../../tests/helpers/commom.helper";

describe("Admin User Integration tests", () => {
  const BASE_URL = "/api/v1/admin/users";
  describe(`GET ${BASE_URL}`, () => {
    it("returns all users", async () => {
      await createUser({
        email: "user1@example.com",
      });
      await createUser({
        email: "user2@example.com",
      });
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent.get(BASE_URL).expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(3);
      expect(body.data[0]).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String),
        banReason: null,
        bannedAt: null,
      });
      expect(body.data[0]).not.toHaveProperty("passwordHash");
    });

    it("should return all users with pagination", async () => {
      for (let i = 0; i < 4; i++) {
        await createUser({
          email: `user${i}@example.com`,
        });
      }
      const page = 1;
      const limit = 4;

      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ page, limit })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(4);
      expect(body.metadata).toMatchObject({
        page,
        limit,
        total: 5,
        totalPages: 2,
      });
    });

    it("should return all users with search filter by email", async () => {
      const email1 = "user1@example.com";
      const name1 = "John Doe";
      await createUser({
        email: email1,
        name: name1,
      });
      await createUser({
        email: "user2@example.com",
      });
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: email1 })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toEqual(
        expect.objectContaining({
          email: email1,
          name: name1,
        }),
      );
    });

    it("should return all users with search filter by name", async () => {
      const email1 = "user1@example.com";
      const name1 = "John Doe";
      await createUser({
        email: email1,
        name: name1,
      });
      await createUser({
        email: "user2@example.com",
      });
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: name1 })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toEqual(
        expect.objectContaining({
          email: email1,
          name: name1,
        }),
      );
    });

    it("should return empty array when page is greater than totalPages", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ page: 100, limit: 10 })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(0);
      expect(body.metadata).toMatchObject({
        page: 100,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it("should return empty array when search is not found", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ search: "notfound" })
        .expect(200);

      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("metadata");
      expect(body.data).toHaveLength(0);
      expect(body.metadata).toMatchObject({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent.get(BASE_URL).expect(403);

      expect(body).toHaveProperty("message");
    });
    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.get(BASE_URL).expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
