import "reflect-metadata";

import { afterAll, beforeEach } from "vitest";
import { container } from "tsyringe";
import { PrismaClient } from "../database/generated/prisma";
import { PrismaDB } from "../database/prisma";
import { env } from "../core/config/env";

export const prisma_test = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_TEST_URL,
    },
  },
});

container.registerInstance(PrismaDB, prisma_test);

beforeEach(async () => {
  await prisma_test.user.deleteMany();
});

afterAll(async () => {
  await prisma_test.$disconnect();
});
