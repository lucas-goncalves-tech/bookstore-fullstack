import { User } from "@prisma/client";
import { prisma_test } from "../setup";
import bcrypt from "bcrypt";

export async function createUser(overrides?: Partial<User>) {
  const hash = bcrypt.hashSync("password", 5);
  return await prisma_test.user.create({
    data: {
      email: `test-${crypto.randomUUID()}@example.com`,
      name: "Test User",
      passwordHash: hash,
      ...overrides,
    },
  });
}
