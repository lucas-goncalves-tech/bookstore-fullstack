import { User } from "@prisma/client";
import { prisma_test } from "../setup";
import bcrypt from "bcrypt";

export async function createUser(overrides?: Partial<User>) {
  const hash = await bcrypt.hash("password", 10);
  return await prisma_test.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: hash,
      ...overrides,
    },
  });
}
