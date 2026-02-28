import { describe, expect, it } from "vitest";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import { createUser } from "../../../../tests/factories/user.factory";
import { req } from "../../../../tests/helpers/commom.helper";
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
} from "../dtos/admin-users.dto";
import { prisma_test } from "../../../../tests/setup";

describe("Admin User Integration tests", () => {
  const BASE_URL = "/api/v1/admin/users";
  describe(`GET ${BASE_URL}`, () => {
    it("should return all users", async () => {
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

    it("should return all users with orderBy asc", async () => {
      await createUser({
        email: "user1@example.com",
      });
      await createUser({
        email: "user2@example.com",
      });
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ order: "asc" })
        .expect(200);
      const first = new Date(body.data[0].createdAt);
      const second = new Date(body.data[1].createdAt);

      expect(first.getTime()).toBeLessThan(second.getTime());
    });

    it("should return all users with orderBy desc", async () => {
      await createUser({
        email: "user1@example.com",
      });
      await createUser({
        email: "user2@example.com",
      });
      const { reqAgent } = await loginWithUser("admin");
      const { body } = await reqAgent
        .get(BASE_URL)
        .query({ order: "desc" })
        .expect(200);
      const first = new Date(body.data[0].createdAt);
      const second = new Date(body.data[1].createdAt);

      expect(first.getTime()).toBeGreaterThan(second.getTime());
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
        })
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
        })
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
    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.get(BASE_URL).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it("should create a new user", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const email = "user@example.com";
      const name = "John Doe";
      const password = "passwordvalid";
      const validBody: AdminCreateUserDto = {
        email,
        name,
        password,
        confirmPassword: password,
        role: "USER",
      };

      const { body } = await reqAgent
        .post(BASE_URL)
        .send(validBody)
        .expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String),
        banReason: null,
        bannedAt: null,
      });
      expect(body.data).not.toHaveProperty("passwordHash");

      const userFromDb = await prisma_test.user.findUnique({
        where: { email },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        email,
        name,
        role: "USER",
        banReason: null,
        bannedAt: null,
      });
    });

    it("should create a new user with ADMIN role", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const email = "user@example.com";
      const name = "John Doe";
      const password = "passwordvalid";
      const validBody: AdminCreateUserDto = {
        email,
        name,
        password,
        confirmPassword: password,
        role: "ADMIN",
      };

      const { body } = await reqAgent
        .post(BASE_URL)
        .send(validBody)
        .expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String),
        banReason: null,
        bannedAt: null,
      });
      expect(body.data).not.toHaveProperty("passwordHash");

      const userFromDb = await prisma_test.user.findUnique({
        where: { email },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        email,
        name,
        role: "ADMIN",
        banReason: null,
        bannedAt: null,
      });
    });

    it("should return 400 when body is invalid", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const invalidBody = {
        email: "invalidEmail",
        name: "in",
        password: "invalid",
        confirmPassword: "invalid",
        role: "invalid",
      };
      const { body } = await reqAgent
        .post(BASE_URL)
        .send(invalidBody)
        .expect(400);
      const errors = body.errors?.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("email");
      expect(errors).toContain("name");
      expect(errors).toContain("password");
      expect(errors).toContain("confirmPassword");
      expect(errors).toContain("role");
    });

    it("should return 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent.post(BASE_URL).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.post(BASE_URL).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`PUT ${BASE_URL}/:id`, async () => {
    it("should update a user", async () => {
      const user = await createUser();
      const { reqAgent } = await loginWithUser("admin");
      const email = "newemail@example.com";
      const name = "John Doe 55";
      const validBody: AdminUpdateUserDto = {
        email,
        name,
        role: "USER",
      };

      const { body } = await reqAgent
        .put(`${BASE_URL}/${user.id}`)
        .send(validBody)
        .expect(200);

      expect(body).toHaveProperty("message");
      expect(body.data).toEqual(
        expect.objectContaining({
          email,
          name,
          role: "USER",
          banReason: null,
          bannedAt: null,
        })
      );
      expect(body.data).not.toHaveProperty("passwordHash");

      const userFromDb = await prisma_test.user.findUnique({
        where: { id: user.id },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toEqual(
        expect.objectContaining({
          email,
          name,
          role: "USER",
          banReason: null,
          bannedAt: null,
        })
      );
    });

    it("should update a user to ADMIN role", async () => {
      const user = await createUser();
      const { reqAgent } = await loginWithUser("admin");
      const email = "newemail@example.com";
      const name = "John Doe 55";
      const role = "ADMIN";
      const validBody: AdminUpdateUserDto = {
        email,
        name,
        role,
      };

      const { body } = await reqAgent
        .put(`${BASE_URL}/${user.id}`)
        .send(validBody)
        .expect(200);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        email,
        name,
        role,
        banReason: null,
        bannedAt: null,
      });
      expect(body.data).not.toHaveProperty("passwordHash");

      const userFromDb = await prisma_test.user.findUnique({
        where: { id: user.id },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        email,
        name,
        role,
        banReason: null,
        bannedAt: null,
      });
    });

    it("should return 400 when body is invalid", async () => {
      const UUID = crypto.randomUUID();
      const { reqAgent } = await loginWithUser("admin");
      const invalidBody = {
        email: "invalidEmail",
        name: "in",
        role: "invalid",
      };
      const { body } = await reqAgent
        .put(`${BASE_URL}/${UUID}`)
        .send(invalidBody)
        .expect(400);
      const errors = body.errors?.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("email");
      expect(errors).toContain("name");
      expect(errors).toContain("role");
    });

    it("should return 404 when user not exists", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const validBody: AdminUpdateUserDto = {
        email: "newemail@example.com",
        name: "John Doe 55",
        role: "USER",
      };
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .put(`${BASE_URL}/${UUID}`)
        .send(validBody)
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("should return 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent.put(`${BASE_URL}/1`).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.put(`${BASE_URL}/1`).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`PATCH ${BASE_URL}`, () => {
    it("should unBan user ", async () => {
      const user = await createUser({ bannedAt: new Date() });
      const { reqAgent } = await loginWithUser("admin");

      const { body } = await reqAgent
        .patch(`${BASE_URL}/${user.id}/restore`)
        .expect(200);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        banReason: null,
        bannedAt: null,
      });

      const userFromDb = await prisma_test.user.findUnique({
        where: { id: user.id },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        banReason: null,
        bannedAt: null,
      });
    });

    it("should return 404 when user not exists", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .patch(`${BASE_URL}/${UUID}/restore`)
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("should return 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .patch(`${BASE_URL}/1/restore`)
        .expect(403);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.patch(`${BASE_URL}/1/restore`).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, async () => {
    it("should delete a user", async () => {
      const user = await createUser();
      const { reqAgent } = await loginWithUser("admin");
      const banReason = "test ban reason";

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${user.id}`)
        .send({ banReason })
        .expect(200);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        banReason: banReason,
        bannedAt: expect.any(String),
      });

      const userFromDb = await prisma_test.user.findUnique({
        where: { id: user.id },
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        banReason: banReason,
        bannedAt: expect.any(Date),
      });
    });

    it("should return 400 when banReason is invalid", async () => {
      const user = await createUser();
      const { reqAgent } = await loginWithUser("admin");
      const banReason = "in";

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${user.id}`)
        .send({ banReason })
        .expect(400);
      const errors = body.errors?.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("banReason");
    });

    it("should return 404 when user not exists", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const banReason = "test ban reason";
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .delete(`${BASE_URL}/${UUID}`)
        .send({ banReason })
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("should return 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent.delete(`${BASE_URL}/1`).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const { body } = await req.delete(`${BASE_URL}/1`).expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
