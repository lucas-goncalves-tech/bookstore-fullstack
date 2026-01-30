import "reflect-metadata";

import { afterAll, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import { container } from "tsyringe";
import { PrismaDB } from "../database/prisma";
import { env } from "../core/config/env";
import { PrismaClient } from "@prisma/client";

export const prisma_test = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_TEST_URL,
    },
  },
});

container.registerInstance(PrismaDB, prisma_test);

const passwordHash = bcrypt.hashSync("12345678", 5);

const user = {
  email: "test@user.com",
  passwordHash,
  name: "User",
};
const admin = {
  email: "test@admin.com",
  passwordHash,
  name: "Admin User",
  role: "ADMIN",
};

beforeEach(async () => {
  await prisma_test.book.deleteMany();
  await prisma_test.category.deleteMany();
  await prisma_test.user.deleteMany();

  await prisma_test.user.createMany({
    data: [user, admin],
  });
});

afterAll(async () => {
  await prisma_test.$disconnect();
});
