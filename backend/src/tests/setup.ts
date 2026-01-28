import { afterAll, beforeEach } from "vitest";
import { prisma_test } from "./global-setup";

// beforeEach(async () => {
//   await prisma_test.user.deleteMany();
// });

afterAll(async () => {
  await prisma_test.$disconnect();
});
