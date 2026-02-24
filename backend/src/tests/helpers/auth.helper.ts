import bcrypt from "bcrypt";
import { ICreateUserInput } from "../../modules/users/interfaces/user.interface";
import { Role, User } from "@prisma/client";
import { prisma_test } from "../setup";
import { app, req } from "./commom.helper";
import { agent } from "supertest";

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
    banReason: null,
    bannedAt: null,
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

const passwordHash = bcrypt.hashSync("12345678", 5);

export async function loginWithUser(
  userType: "user" | "user-second" | "admin" = "user",
) {
  const reqAgent = agent(app);
  const role: Role = userType === "admin" ? "ADMIN" : "USER";
  const email = `test@${userType}.com`;
  const user = await prisma_test.user.create({
    data: {
      email,
      passwordHash,
      name: "User",
      role,
    },
  });

  const { body, status } = await reqAgent.post(BASE_URL + "/login").send({
    email,
    password: "12345678",
  });

  return {
    loginBody: body,
    loginStatus: status,
    reqAgent,
    user,
  };
}
