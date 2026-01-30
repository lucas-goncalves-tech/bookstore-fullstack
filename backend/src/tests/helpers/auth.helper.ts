import { container } from "tsyringe";
import { User } from "../../database/generated/prisma";
import { ICreateUserInput } from "../../modules/users/interfaces/user.interface";
import supertest from "supertest";
import { App } from "../../app";

export function generateNewUser(
  override?: Record<string, unknown>,
): ICreateUserInput {
  return {
    email: "fake@test.com",
    name: "Fake User",
    password: "12345678",
    confirmPassword: "12345678",
    ...override,
  };
}

export function generateFakeUser(override?: Record<string, unknown>): User {
  return {
    id: "UUID",
    email: "fake@test.com",
    name: "Fake User",
    role: "USER",
    passwordHash: "1234",
    ...override,
  };
}

export const BASE_URL = "/api/v1/auth";
export const app = container.resolve(App).getServer();
export const req = supertest(app);

export async function postNewUser(
  override?: ICreateUserInput | Record<string, unknown>,
) {
  const newUser = generateNewUser(override);

  const { body, status } = await req.post(BASE_URL + "/register").send(newUser);

  return {
    registerBody: body,
    registerStatus: status,
    newUser,
  };
}
