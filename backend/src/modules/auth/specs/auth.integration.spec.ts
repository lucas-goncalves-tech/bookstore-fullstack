import { describe, expect, it } from "vitest";
import { postNewUser } from "../../../tests/helpers/auth.helper";

const BASE_URL = "/api/v1/auth";

describe(`POST ${BASE_URL}/register`, () => {
  it("should return status 201 when body is valid", async () => {
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

  it("should return status 400 when body has more fields than expect", async () => {
    const { registerStatus, registerBody } = await postNewUser({
      role: "ADMIN",
    });

    expect(registerStatus).toBe(400);
    expect(registerBody).toHaveProperty("message");
    expect(registerBody).toHaveProperty("errors");
  });

  it("should return status 400 when email field not have @", async () => {
    const { registerStatus, registerBody } = await postNewUser({
      email: "emailwithoutAT.com",
    });

    expect(registerStatus).toBe(400);
    expect(registerBody).toHaveProperty("message");
    expect(registerBody).toHaveProperty("errors");
  });

  it("should return status 400 when name field have invalid char", async () => {
    const { registerStatus, registerBody } = await postNewUser({
      name: "\u200B\u200B\u200B",
    });

    expect(registerStatus).toBe(400);
    expect(registerBody).toHaveProperty("message");
    expect(registerBody).toHaveProperty("errors");
  });

  it("should return status 400 when password field not match confirmPassword", async () => {
    const { registerStatus, registerBody } = await postNewUser({
      password: "12345678",
      confirmPassword: "123456789",
    });

    expect(registerStatus).toBe(400);
    expect(registerBody).toHaveProperty("message");
    expect(registerBody).toHaveProperty("errors");
  });
});
