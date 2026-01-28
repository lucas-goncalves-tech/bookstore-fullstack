import { User } from "../../database/generated/prisma";
import { ICreateUserInput } from "../../modules/users/interfaces/user.interface";

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
