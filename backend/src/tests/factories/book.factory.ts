import { Book } from "@prisma/client";
import { prisma_test } from "../setup";

export async function createBook(override?: Partial<Book>) {
  return prisma_test.book.create({
    data: {
      categoryId: override?.categoryId || null,
      title: "Harry Potter",
      description: "Ficção e ação com aventura em Hogwarts",
      author: "J.K Roling",
      price: 99.1,
      stock: 10,
      ...override,
    },
  });
}
