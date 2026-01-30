import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { prisma_test } from "../../../tests/setup";
import { req } from "../../../tests/helpers/commom.helper";
import { Book } from "@prisma/client";

const BASE_URL = "/api/v1/books";

function expectecBookShape(): Book {
  return {
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    author: expect.any(String),
    price: expect.any(Number),
    stock: expect.any(Number),
    coverUrl: expect.toSatisfy((v) => v === null || typeof v === "string"),
    categoryId: expect.toSatisfy((v) => v === null || typeof v === "string"),
    createdAt: expect.anything(),
    deletedAt: expect.toSatisfy((v) => v === null || typeof v === "string"),
  };
}

describe(`GET ${BASE_URL}`, () => {
  beforeEach(async () => {
    const { id } = await createCategory();
    await Promise.all(
      Array.from({ length: 15 }, () => {
        return prisma_test.book.create({
          data: {
            categoryId: id,
            title: "Harry Potter",
            description: "Ficção e ação com aventura em Hogwarts",
            author: "J.K Roling",
            price: 99.1,
            stock: 10,
          },
        });
      }),
    );
  });
  it("should return status 200 with books and pagination", async () => {
    const { body, status } = await req.get(BASE_URL);

    expect(status).toBe(200);
    expect(body.data).toHaveLength(10);
    expect(body.data[0]).toMatchObject(expectecBookShape());
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 15,
      totalPages: 2,
    });
  });
});
