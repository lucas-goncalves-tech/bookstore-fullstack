import { agent } from "supertest";
import { ICreateUserInput } from "../../modules/users/interfaces/user.interface";
import { app, req } from "../helpers/commom.helper";
import { User } from "@prisma/client";

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

export async function loginWithUser(role: "user" | "user-second" | "admin") {
  const email = `test@${role}.com`;
  const reqAgent = agent(app);

  const { body, status } = await reqAgent.post(BASE_URL + "/login").send({
    email,
    password: "12345678",
  });

  return {
    loginBody: body,
    loginStatus: status,
    reqAgent,
  };
}
