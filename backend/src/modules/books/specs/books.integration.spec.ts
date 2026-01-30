import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { Book } from "@prisma/client";
import { createBook } from "../../../tests/factories/book.factory";
import { Decimal } from "@prisma/client/runtime/library";
import { ICreateBookInput } from "../../books/interface/books.interface";
import { loginWithUser } from "../../../tests/helpers/auth.helper";

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

function generateNewBook(overrides?: ICreateBookInput): ICreateBookInput {
  return {
    title: "Test Book",
    description: "Test Book Description",
    author: "Test Author",
    price: new Decimal("10.00"),
    stock: 10,
    coverUrl: "https://test.com/cover.jpg",
    categoryId: "1",
    ...overrides,
  };
}

describe(`GET ${BASE_URL} - Pagination`, () => {
  beforeEach(async () => {
    const { id } = await createCategory();

    await Promise.all(
      Array.from({ length: 15 }, () => {
        return createBook({
          categoryId: id,
        });
      }),
    );
  });

  it("should return paginated books with default limit", async () => {
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

  it("should return remaining items on page 2", async () => {
    const { body, status } = await req.get(BASE_URL + "?page=2");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(5);
    expect(body.data[0]).toMatchObject(expectecBookShape());
    expect(body.metadata).toMatchObject({
      page: 2,
      limit: 10,
      total: 15,
      totalPages: 2,
    });
  });

  it("should paginate with custom limit", async () => {
    const { body, status } = await req.get(BASE_URL + "?limit=5");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(5);
    expect(body.data[0]).toMatchObject(expectecBookShape());
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 5,
      total: 15,
      totalPages: 3,
    });
  });

  it("should return empty array when page exceeds total", async () => {
    const { body, status } = await req.get(BASE_URL + "?page=5");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(0);
    expect(body.metadata).toMatchObject({
      page: 5,
      limit: 10,
      total: 15,
      totalPages: 2,
    });
  });
});

describe(`GET ${BASE_URL} - Filters`, () => {
  it("should filter books by categoryId", async () => {
    const adventure = await createCategory({
      name: "adventure",
    });
    for (let i = 1; i <= 5; i++) {
      await createBook({
        categoryId: adventure.id,
      });
    }

    const action = await createCategory({
      name: "action",
    });
    for (let i = 1; i <= 5; i++) {
      await createBook({
        categoryId: action.id,
      });
    }

    const { body, status } = await req.get(
      BASE_URL + "?categoryId=" + adventure.id,
    );

    expect(status).toBe(200);
    expect(body.data).toHaveLength(5);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    });
  });

  it("should search books by title", async () => {
    const title = "Lord of the ring";

    await createBook({
      title: "The banana diary",
    });

    await createBook({
      title,
    });

    const { body, status } = await req.get(BASE_URL + "?search=" + title);

    expect(status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe(title);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  // ✅ 1 teste de combinação
  it("should combine filters with pagination", async () => {
    const title = "Lord of the ring";
    for (let i = 1; i <= 15; i++) {
      await createBook({
        title,
      });
    }

    for (let i = 1; i <= 5; i++) {
      await createBook({
        title: "The banana diary",
      });
    }

    const { status, body } = await req.get(
      BASE_URL + "?search=" + title + "&page=2&limit=5",
    );

    expect(status).toBe(200);
    expect(body.data).toHaveLength(5);
    expect(body.metadata).toMatchObject({
      page: 2,
      limit: 5,
      total: 15,
      totalPages: 3,
    });
  });

  it("should filter books by min price", async () => {
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("10.00"),
      });
    }
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("20.00"),
      });
    }
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("30.00"),
      });
    }

    const { body, status } = await req.get(BASE_URL + "?minPrice=20");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(10);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 10,
      totalPages: 1,
    });
  });

  it("should filter books by max price", async () => {
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("10.00"),
      });
    }
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("20.00"),
      });
    }
    for (let i = 1; i <= 5; i++) {
      await createBook({
        price: new Decimal("30.00"),
      });
    }

    const { body, status } = await req.get(BASE_URL + "?maxPrice=10");

    expect(status).toBe(200);
    expect(body.data).toHaveLength(5);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    });
  });
});

describe(`POST ${BASE_URL}`, () => {
  it("should allow ADMIN to create a book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newBook = generateNewBook();

    const { body, status } = await reqAgent.post(BASE_URL).send(newBook);

    expect(status).toBe(201);
    expect(body).toMatchObject(expectecBookShape());
    expect(body.title).toBe(newBook.title);
    expect(body.author).toBe(newBook.author);
  });

  it("should return status 403 when USER try to create a book", async () => {
    const { reqAgent } = await loginWithUser("user");
    const newBook = generateNewBook();

    const { body, status } = await reqAgent.post(BASE_URL).send(newBook);

    expect(status).toBe(403);
    expect(body).toHaveProperty("message");
  });

  it("should return status 401 when non authenticated try to create a book", async () => {
    const newBook = generateNewBook();

    const { body, status } = await req.post(BASE_URL).send(newBook);

    expect(status).toBe(401);
    expect(body).toHaveProperty("message");
  });
});
