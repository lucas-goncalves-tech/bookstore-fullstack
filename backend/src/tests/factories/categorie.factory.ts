import { Category } from "@prisma/client";
import { prisma_test } from "../setup";

export async function createCategory(override?: Partial<Category>) {
  return await prisma_test.category.create({
    data: {
      name: "Ação",
      description: "Muita ação",
      slug: "acao",
      ...override,
    },
  });
}
