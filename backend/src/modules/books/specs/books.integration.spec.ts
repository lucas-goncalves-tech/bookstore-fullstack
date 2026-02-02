import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { Book } from "@prisma/client";
import { createBook } from "../../../tests/factories/book.factory";
import { Decimal } from "@prisma/client/runtime/library";
import { ICreateBookInput } from "../../books/interface/books.interface";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import path from "node:path";

const BASE_URL = "/api/v1/books";

function expectecBookShape(): Book {
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

async function generateNewBook(
  overrides?: Partial<ICreateBookInput> | Record<string, unknown>,
): Promise<ICreateBookInput> {
  const { id } = await createCategory();
  const payload: ICreateBookInput = {
    title: "Test Book",
    description: "Test Book Description",
    author: "Test Author",
    price: new Decimal("10.00"),
    stock: 10,
    categoryId: id,
    ...overrides,
  };

  return payload;
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
    const { body } = await req.get(BASE_URL).expect(200);

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
    const { body } = await req.get(BASE_URL + "?page=2").expect(200);

    expect(body.data).toHaveLength(5);
    expect(body.data[0]).toMatchObject(expectecBookShape());
    expect(body.metadata).toMatchObject({
      page: 2,
      limit: 10,
      total: 15,
      totalPages: 2,
    });
  });

  it("should return paginate books with custom limit", async () => {
    const { body } = await req.get(BASE_URL + "?limit=5").expect(200);

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
    const { body } = await req.get(BASE_URL + "?page=5").expect(200);

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

    const { body } = await req
      .get(BASE_URL + "?categoryId=" + adventure.id)
      .expect(200);

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

    const { body } = await req.get(BASE_URL + "?search=" + title).expect(200);

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

    const { body } = await req
      .get(BASE_URL + "?search=" + title + "&page=2&limit=5")
      .expect(200);

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

    const { body } = await req.get(BASE_URL + "?minPrice=20").expect(200);

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

    const { body } = await req.get(BASE_URL + "?maxPrice=10").expect(200);

    expect(body.data).toHaveLength(5);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    });
  });
});

describe(`GET ${BASE_URL}/:id`, () => {
  it("should return book by id", async () => {
    const book = await createBook();
    const { body } = await req.get(BASE_URL + "/" + book.id).expect(200);

    expect(body).toMatchObject(expectecBookShape());
    expect(body.id).toBe(book.id);
  });

  it("should return status 404 when book not found", async () => {
    const UUID = crypto.randomUUID();
    const { body } = await req.get(BASE_URL + "/" + UUID).expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return status 400 when id is invalid", async () => {
    const { body } = await req.get(BASE_URL + "/invalid-uuid").expect(400);
    const errors = body.errors.map((e: object) => Object.keys(e)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("id");
  });
});

describe(`POST ${BASE_URL}`, () => {
  it("should allow ADMIN to create a book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newBook = await generateNewBook();

    const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(201);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectecBookShape());
    expect(body.data.title).toBe(newBook.title);
    expect(body.data.author).toBe(newBook.author);
  });

  it("should return status 400 when ADMIN try to create a book with invalid data", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newBook = await generateNewBook({
      title: "",
      description: "",
      price: new Decimal("0"),
      stock: 0,
      categoryId: "invalid-uuid",
      author: "",
    });

    const { body } = await reqAgent.post(BASE_URL).send(newBook);
    const errors = body.errors.map((e: object) => Object.keys(e)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("title");
    expect(errors).toContain("description");
    expect(errors).toContain("author");
    expect(errors).toContain("price");
    expect(errors).toContain("stock");
    expect(errors).toContain("categoryId");
  });

  it("should return status 403 when USER try to create a book", async () => {
    const { reqAgent } = await loginWithUser("user");
    const newBook = generateNewBook();

    const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return status 401 when non authenticated try to create a book", async () => {
    const newBook = generateNewBook();

    const { body } = await req.post(BASE_URL).send(newBook).expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`POST ${BASE_URL}/:id/cover`, () => {
  it("should allow ADMIN to upload a cover image to book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();
    const coverPath = path.resolve(__dirname, "fixtures/valid-size.jpg");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + book.id + "/cover")
      .attach("cover", coverPath)
      .expect(201);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectecBookShape());
  });

  it("should return status 400 when don't attach file", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();

    const { body } = await reqAgent
      .post(BASE_URL + "/" + book.id + "/cover")
      .expect(400);

    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("errors");
  });

  it("should return status 400 when file type is invalid (only jpeg, jpg, png, webp)", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();
    const coverPath = path.resolve(__dirname, "fixtures/invalid-type.gif");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + book.id + "/cover")
      .attach("cover", coverPath)
      .expect(400);

    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("errors");
  });

  it("should return status 404 when book not found", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();
    const file = path.resolve(__dirname, "fixtures/valid-size.jpg");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + UUID + "/cover")
      .attach("cover", file)
      .expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return status 403 when USER try to upload", async () => {
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
      .expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return status 401 when non authenticated try to upload", async () => {
    const { body } = await req
      .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
      .expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`PUT ${BASE_URL}/:id`, () => {
  it("should allow ADMIN to update a book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();
    const updatedBook = await generateNewBook({
      title: "Novo titulo",
      author: "Novo autor",
      description: "Nova descricao",
    });

    const { body } = await reqAgent
      .put(BASE_URL + "/" + book.id)
      .send(updatedBook)
      .expect(200);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectecBookShape());
    expect(body.data.title).toBe(updatedBook.title);
    expect(body.data.author).toBe(updatedBook.author);
  });

  it("should return status 400 when ADMIN try to update a book with invalid data", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();
    const updatedBook = await generateNewBook({
      title: "",
      description: "",
      author: "",
      price: new Decimal("0"),
      stock: 0,
      categoryId: "invalid-uuid",
    });

    const { body } = await reqAgent
      .put(BASE_URL + "/" + book.id)
      .send(updatedBook)
      .expect(400);

    const errors = body.errors.map((e: object) => Object.keys(e)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("title");
    expect(errors).toContain("description");
    expect(errors).toContain("author");
    expect(errors).toContain("price");
    expect(errors).toContain("stock");
    expect(errors).toContain("categoryId");
  });

  it("should return status 404 when ADMIN try to update a book that not exists", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();
    const updatedBook = await generateNewBook({
      title: "Novo titulo",
      author: "Novo autor",
      description: "Nova descricao",
    });

    const { body } = await reqAgent
      .put(BASE_URL + "/" + UUID)
      .send(updatedBook)
      .expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return status 403 when USER try to update a book", async () => {
    const { reqAgent } = await loginWithUser("user");
    const book = await createBook();
    const updatedBook = await generateNewBook({
      title: "Novo titulo",
      author: "Novo autor",
      description: "Nova descricao",
    });

    const { body } = await reqAgent
      .put(BASE_URL + "/" + book.id)
      .send(updatedBook)
      .expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return status 401 when non authenticated try to update a book", async () => {
    const { body } = await req.put(BASE_URL + "/1234").expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`DELETE ${BASE_URL}/:id`, () => {
  it("should allow ADMIN to delete a book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();

    await reqAgent.delete(BASE_URL + "/" + book.id).expect(204);
  });

  it("should return status 400 when ADMIN try to delete a book with invalid UUID", async () => {
    const { reqAgent } = await loginWithUser("admin");

    const { body } = await reqAgent
      .delete(BASE_URL + "/invalid-uuid")
      .expect(400);

    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("errors");
  });

  it("should return status 404 when ADMIN try to delete a book that not exists", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();

    const { body } = await reqAgent.delete(BASE_URL + "/" + UUID).expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return status 403 when USER try to delete a book", async () => {
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.delete(BASE_URL + "/1234").expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return status 401 when non authenticated try to delete a book", async () => {
    const { body } = await req
      .delete(BASE_URL + "/" + "invalid-uuid")
      .expect(401);

    expect(body).toHaveProperty("message");
  });
});
