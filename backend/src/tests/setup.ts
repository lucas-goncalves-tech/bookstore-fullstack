import "reflect-metadata";

import { afterAll, beforeEach } from "vitest";
import { container } from "tsyringe";
import { PrismaDB } from "../database/prisma";
import { env } from "../core/config/env";
import { PrismaClient } from "@prisma/client";

const workerId = process.env.VITEST_POOL_ID || "1";
const dbUrl = `${env.DATABASE_TEST_URL}?schema=${workerId}`;
export const prisma_test = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

container.registerInstance(PrismaDB, prisma_test);

// Mock do StorageProvider para testes (evita chamadas reais ao Cloudinary)
container.register("StorageProvider", {
  useValue: {
    uploadCover: async () => ({
      fullUrl: "https://mock.cloudinary.com/full.webp",
      thumbUrl: "https://mock.cloudinary.com/thumb.webp",
    }),
    deleteFile: async () => undefined,
  },
});

beforeEach(async () => {
  await prisma_test.$transaction([
    prisma_test.review.deleteMany(),
    prisma_test.orderItem.deleteMany(),
    prisma_test.order.deleteMany(),
    prisma_test.category.deleteMany(),
    prisma_test.book.deleteMany(),
    prisma_test.session.deleteMany(),
    prisma_test.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma_test.$disconnect();
});
