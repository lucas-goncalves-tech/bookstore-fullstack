import { Book } from "@prisma/client";
import { expect } from "vitest";

export function expectecBookShape(): Book {
  return {
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    author: expect.any(String),
    price: expect.any(String),
    stock: expect.any(Number),
    coverUrl: expect.toSatisfy((v) => v === null || typeof v === "string"),
    coverThumbUrl: expect.toSatisfy((v) => v === null || typeof v === "string"),
    categoryId: expect.toSatisfy((v) => v === null || typeof v === "string"),
    createdAt: expect.anything(),
    deletedAt: expect.toSatisfy((v) => v === null || typeof v === "string"),
  };
}
