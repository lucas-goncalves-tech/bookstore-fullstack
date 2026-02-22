import "reflect-metadata";

import { afterAll, beforeEach } from "vitest";
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
  await prisma_test.review.deleteMany();
  await prisma_test.orderItem.deleteMany();
  await prisma_test.order.deleteMany();
  await prisma_test.category.deleteMany();
  await prisma_test.book.deleteMany();
  await prisma_test.session.deleteMany();
  await prisma_test.user.deleteMany();
});

afterAll(async () => {
  await prisma_test.$disconnect();
});
