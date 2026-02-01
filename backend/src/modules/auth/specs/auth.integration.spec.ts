import { describe, expect, it } from "vitest";
import { postNewUser, BASE_URL } from "../../../tests/helpers/auth.helper";
import { req } from "../../../tests/helpers/commom.helper";

describe(`POST ${BASE_URL}/register`, () => {
  it("should register user with valid body", async () => {
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
  });

  it("should return status 409 when email already exist", async () => {
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

  it("should return status 400 when body contain invalid fields", async () => {
    const { registerStatus, registerBody } = await postNewUser({
      name: "\u200B\u200B\u200B",
      email: "not-valid-com",
      password: "1234567",
      confirmPassword: "123456789",
    });

    const errors = registerBody.errors.map((e: object) => Object.keys(e)[0]);

    expect(registerStatus).toBe(400);
    expect(registerBody).toHaveProperty("message");
    expect(errors).toContain("name");
    expect(errors).toContain("email");
    expect(errors).toContain("password");
    expect(errors).toContain("confirmPassword");
  });
});

describe(`POST ${BASE_URL}/login`, () => {
  it("should login and set cookies with valid credentials", async () => {
    const { newUser } = await postNewUser();

    const { headers, body } = await req
      .post(BASE_URL + "/login")
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect(204);
    const cookies = headers["set-cookie"][0];

    expect(body).toEqual({});
    expect(cookies).contains("sid");
    expect(cookies).contains("HttpOnly");
  });

  it("should return status 401 when credentials is invalid", async () => {
    const { body } = await req
      .post(BASE_URL + "/login")
      .send({
        email: "invalid@test.com",
        password: "12345678",
      })
      .expect(401);

    expect(body).toHaveProperty("message");
  });

  it("should return status 400 when body have invalid fields", async () => {
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
});
