import { describe, expect, it } from "vitest";
import {
  postNewUser,
  BASE_URL,
  loginWithUser,
} from "../../../tests/helpers/auth.helper";
import { req } from "../../../tests/helpers/commom.helper";
import { createUser } from "../../../tests/factories/user.factory";
import { prisma_test } from "../../../tests/setup";

describe("AuthIntegration", () => {
  describe(`POST ${BASE_URL}/register`, () => {
    it("should register a user when data is valid", async () => {
      const { registerBody, registerStatus, newUser } = await postNewUser();

      expect(registerStatus).toBe(201);
      expect(registerBody).toHaveProperty("message");
      expect(registerBody.data).toMatchObject({
        email: newUser.email,
        name: newUser.name,
        role: "USER",
      });
      expect(registerBody.data).not.toHaveProperty("id");
      expect(registerBody.data).not.toHaveProperty("passwordHash");

      const user = await prisma_test.user.findUnique({
        where: {
          email: newUser.email,
        },
      });
      expect(user).toBeTruthy();
      expect(user?.email).toEqual(newUser.email);
      expect(user?.name).toEqual(newUser.name);
      expect(user?.role).toEqual("USER");
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toEqual(newUser.password);
    });

    it("should return 409 when email is already registered", async () => {
      const email = "user@exist.com";
      await postNewUser({
        email,
      });
      const { registerBody, registerStatus } = await postNewUser({
        email,
      });

      expect(registerStatus).toBe(409);
      expect(registerBody).toHaveProperty("message");
    });

    it("should return 400 for invalid fields", async () => {
      const { registerStatus, registerBody } = await postNewUser({
        name: "\u200B\u200B\u200B",
        email: "not-valid-com",
        password: "1234567",
        confirmPassword: "12345",
        role: "ADMIN",
      });

      const errors = registerBody.errors.map((e: object) => Object.keys(e)[0]);

      expect(registerStatus).toBe(400);
      expect(registerBody).toHaveProperty("message");
      expect(errors).toContain("name");
      expect(errors).toContain("email");
      expect(errors).toContain("password");
      expect(errors).toContain("confirmPassword");
      expect(errors).toContain("");
    });
  });

  describe(`POST ${BASE_URL}/login`, () => {
    it("should login and set cookies when credentials are valid", async () => {
      const user = await createUser();

      const { headers, body } = await req
        .post(BASE_URL + "/login")
        .send({
          email: user.email,
          password: "password",
        })
        .expect(204);
      const cookies = headers["set-cookie"];

      expect(body).toEqual({});
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining("sid="),
          expect.stringContaining("refresh-sid="),
          expect.stringContaining("HttpOnly"),
        ]),
      );
    });

    it("should return 401 for invalid credentials", async () => {
      const { body } = await req
        .post(BASE_URL + "/login")
        .send({
          email: "invalid@test.com",
          password: "12345678",
        })
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("should return 400 for invalid fields", async () => {
      const { body } = await req
        .post(BASE_URL + "/login")
        .send({
          email: "not-valid-com",
          password: "123",
        })
        .expect(400);
      const errors = body.errors.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("email");
      expect(errors).toContain("password");
    });

    it("should return 403 if the user is banned", async () => {
      const user = await createUser({
        bannedAt: new Date(),
        banReason: "Violated terms of service",
      });

      const { body } = await req
        .post(BASE_URL + "/login")
        .send({
          email: user.email,
          password: "password", // default password from factory
        })
        .expect(403);

      expect(body).toHaveProperty("message");
      expect(body.message).toContain("Usuário banido");
    });
  });

  describe(`GET ${BASE_URL}/refresh`, () => {
    it("should refresh tokens and return new cookies when the refresh token is valid", async () => {
      const { reqAgent, user } = await loginWithUser();

      const { headers, body } = await reqAgent
        .get(BASE_URL + "/refresh")
        .expect(204);

      const cookies = headers["set-cookie"];

      expect(body).toEqual({});
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining("sid="),
          expect.stringContaining("refresh-sid="),
          expect.stringContaining("HttpOnly"),
        ]),
      );

      const session = await prisma_test.session.findFirst({
        where: {
          userId: user.id,
          revokedAt: null,
        },
      });

      expect(session).toBeTruthy();
      expect(session?.userId).toBe(user.id);
    });

    it("should revoke all sessions and return 401 if token is reused (session revoked)", async () => {
      const { reqAgent, user } = await loginWithUser();

      await req
        .post(BASE_URL + "/login")
        .send({ email: user.email, password: "12345678" })
        .expect(204); // GERA SEGUNDA SESSÃO!
      await req
        .post(BASE_URL + "/login")
        .send({ email: user.email, password: "12345678" })
        .expect(204); // GERA TERCEIRA SESSÃO!

      await prisma_test.session.updateMany({
        where: { userId: user.id },
        data: { revokedAt: new Date() },
      });

      const { body } = await reqAgent.get(BASE_URL + "/refresh").expect(401);

      expect(body).toHaveProperty("message");

      const sessionFromDB = await prisma_test.session.findMany({
        where: { userId: user.id },
      });

      expect(sessionFromDB).toHaveLength(3);
      sessionFromDB.forEach((session) => {
        expect(session.revokedAt).not.toBeNull();
      });
    });

    it("should revoke all sessions and return 401 if the user is banned", async () => {
      const { reqAgent, user } = await loginWithUser();

      await req
        .post(BASE_URL + "/login")
        .send({ email: user.email, password: "12345678" })
        .expect(204); // GERA SEGUNDA SESSÃO!
      await req
        .post(BASE_URL + "/login")
        .send({ email: user.email, password: "12345678" })
        .expect(204); // GERA TERCEIRA SESSÃO!

      await prisma_test.user.update({
        where: { id: user.id },
        data: { bannedAt: new Date(), banReason: "Violação dos termos" },
      });

      const { body } = await reqAgent.get(BASE_URL + "/refresh").expect(401);

      expect(body).toHaveProperty("message");

      const sessionFromDB = await prisma_test.session.findMany({
        where: { userId: user.id },
      });

      expect(sessionFromDB).toHaveLength(3);
      sessionFromDB.forEach((session) => {
        expect(session.revokedAt).not.toBeNull();
      });
    });

    it("should return 401 if no cookie is provided", async () => {
      const { body } = await req
        .get(BASE_URL + "/refresh")
        .send()
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 for an invalid or forged refresh cookie", async () => {
      const fakeCookies = ["refresh-sid=invalid.token.here; HttpOnly"];

      const { body } = await req
        .get(BASE_URL + "/refresh")
        .set("Cookie", fakeCookies)
        .send()
        .expect(401);

      expect(body).toHaveProperty("message");
    });

    it("should return 401 if the session is expired", async () => {
      const { reqAgent, user } = await loginWithUser();

      await prisma_test.session.updateMany({
        where: { userId: user.id },
        data: { expiresAt: new Date(Date.now() - 10000) },
      });

      const { body } = await reqAgent.get(BASE_URL + "/refresh").expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`GET ${BASE_URL}/logout`, () => {
    it("should revoke the session and clear cookies when logged in", async () => {
      const { reqAgent, user } = await loginWithUser();

      const { headers, body } = await reqAgent
        .get(BASE_URL + "/logout")
        .expect(204);

      const cookies = headers["set-cookie"];

      expect(body).toEqual({});
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining("sid=;"),
          expect.stringContaining("refresh-sid=;"),
        ]),
      );

      const sessionFromDB = await prisma_test.session.findFirst({
        where: { userId: user.id },
      });

      expect(sessionFromDB).toBeTruthy();
      expect(sessionFromDB?.revokedAt).not.toBeNull();
    });

    it("should return 401 if no cookie is provided", async () => {
      const { body } = await req.get(BASE_URL + "/logout").expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
