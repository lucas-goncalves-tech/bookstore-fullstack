import { Book } from "@prisma/client";
import { expect } from "vitest";

export function expectecBookShape(overrides?: Partial<Book>): Book {
  return {
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    author: expect.any(String),
    price: expect.any(String),
    stock: expect.any(Number),
    coverUrl: null,
    coverThumbUrl: null,
    categoryId: expect.toSatisfy((v) => v === null || typeof v === "string"),
    createdAt: expect.anything(),
    deletedAt: null,
    ...overrides,
  };
}
