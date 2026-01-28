import { container } from "tsyringe";
import { App } from "../../../app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { generateNewUser } from "../../../tests/helpers/auth.helper";

const BASE_URL = "/api/v1/auth";
const app = container.resolve(App).getServer();
const req = supertest(app);

describe(`POST ${BASE_URL}/register`, () => {
  it("should return status 201 when body is valid", async () => {
    const newUser = generateNewUser();

    const { body, status } = await req
      .post(BASE_URL + "/register")
      .send(newUser);

    expect(status).toBe(201);
    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject({
      email: expect.any(String),
      name: expect.any(String),
      role: "USER",
    });
    expect(body).not.toHaveProperty("id");
    expect(body).not.toHaveProperty("passwordHash");
  });
});
