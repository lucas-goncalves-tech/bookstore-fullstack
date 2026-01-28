import { container } from "tsyringe";
import { User } from "../../database/generated/prisma";
import { ICreateUserInput } from "../../modules/users/interfaces/user.interface";
import supertest from "supertest";
import { App } from "../../app";
import { ICreateUserResponse } from "../../modules/auth/interface/auth.interface";

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

const BASE_URL = "/api/v1/auth";
const app = container.resolve(App).getServer();
const req = supertest(app);

export async function postNewUser(
  override?: ICreateUserInput | Record<string, unknown>,
) {
  const newUser = generateNewUser(override);

  const { body, status } = await req.post(BASE_URL + "/register").send(newUser);

  return {
    registerBody: body as ICreateUserResponse,
    registerStatus: status,
    newUser,
  };
}
