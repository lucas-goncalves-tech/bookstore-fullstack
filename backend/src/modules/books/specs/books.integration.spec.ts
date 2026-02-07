import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { Book, Review } from "@prisma/client";
import { createBook } from "../../../tests/factories/book.factory";
import { Decimal } from "@prisma/client/runtime/library";
import { ICreateBookInput } from "../../books/interface/books.interface";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import path from "node:path";
import { createReview } from "../../../tests/factories/review.factory";

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

function expectedReviewShape() {
  return {
    id: expect.any(String),
    rating: expect.any(Number),
    comment: expect.any(String),
    bookId: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    user: {
      name: expect.any(String),
    },
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

function generateReviewData(overrides?: Partial<Review>) {
  return {
    rating: 5,
    comment: "Great book!",
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

  it("should return 200 and paginated books with default limit of 10", async () => {
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

  it("should return 200 and remaining items when requesting page 2", async () => {
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

  it("should return 200 and paginated books when custom limit is provided", async () => {
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

  it("should return 200 and empty array when page exceeds total pages", async () => {
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
  it("should return 200 and filtered books when categorySlug is provided", async () => {
    const adventure = await createCategory({
      name: "adventure",
      slug: "adventure",
    });
    for (let i = 1; i <= 5; i++) {
      await createBook({
        categoryId: adventure.id,
      });
    }

    const action = await createCategory({
      name: "action",
      slug: "action",
    });
    for (let i = 1; i <= 5; i++) {
      await createBook({
        categoryId: action.id,
      });
    }

    const { body } = await req
      .get(BASE_URL + "?categorySlug=" + adventure.slug)
      .expect(200);

    expect(body.data).toHaveLength(5);
    expect(body.metadata).toMatchObject({
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    });
  });

  it("should return 200 and filtered books when search query matches title", async () => {
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
  it("should return 200 and filtered paginated books when combining search with pagination", async () => {
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

  it("should return 200 and filtered books when minPrice is provided", async () => {
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

  it("should return 200 and filtered books when maxPrice is provided", async () => {
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
  it("should return 200 and book data when valid ID is provided", async () => {
    const book = await createBook();
    const { body } = await req.get(BASE_URL + "/" + book.id).expect(200);

    expect(body).toMatchObject(expectecBookShape());
    expect(body.id).toBe(book.id);
  });

  it("should return 404 NotFound when book ID does not exist", async () => {
    const UUID = crypto.randomUUID();
    const { body } = await req.get(BASE_URL + "/" + UUID).expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return 400 BadRequest when ID is not a valid UUID", async () => {
    const { body } = await req.get(BASE_URL + "/invalid-uuid").expect(400);
    const errors = body.errors.map((e: object) => Object.keys(e)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("id");
  });
});

describe(`GET ${BASE_URL}/:id/reviews`, () => {
  it("should return all reviews from a book", async () => {
    const review = await createReview();

    const { body } = await req
      .get(`${BASE_URL}/${review.bookId}/reviews`)
      .expect(200);

    expect(body).toHaveLength(1);
    expect(body).toEqual(expect.arrayContaining([expectedReviewShape()]));
  });

  it("should return empty array when user has not reviewed the book", async () => {
    const book = await createBook();
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent
      .get(`${BASE_URL}/${book.id}/reviews`)
      .expect(200);

    expect(body).toEqual([]);
  });

  it("should return 404 NotFound when book ID does not exist", async () => {
    const UUID = crypto.randomUUID();
    const { body } = await req
      .get(BASE_URL + "/" + UUID + "/reviews")
      .expect(404);

    expect(body).toHaveProperty("message");
  });
});

describe(`POST ${BASE_URL}`, () => {
  it("should return 201 and create book when ADMIN sends valid data", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newBook = await generateNewBook();

    const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(201);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectecBookShape());
    expect(body.data.title).toBe(newBook.title);
    expect(body.data.author).toBe(newBook.author);
  });

  it("should return 400 BadRequest when ADMIN sends invalid fields", async () => {
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

  it("should return 403 Forbidden when USER tries to create a book", async () => {
    const { reqAgent } = await loginWithUser("user");
    const newBook = generateNewBook();

    const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to create a book", async () => {
    const newBook = generateNewBook();

    const { body } = await req.post(BASE_URL).send(newBook).expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`POST ${BASE_URL}/:id/cover`, () => {
  it("should return 201 and upload cover when ADMIN attaches valid image", async () => {
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

  it("should return 400 BadRequest when no file is attached", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();

    const { body } = await reqAgent
      .post(BASE_URL + "/" + book.id + "/cover")
      .expect(400);

    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("errors");
  });

  it("should return 400 BadRequest when file type is not allowed (only jpeg, jpg, png, webp)", async () => {
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

  it("should return 404 NotFound when book ID does not exist", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();
    const file = path.resolve(__dirname, "fixtures/valid-size.jpg");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + UUID + "/cover")
      .attach("cover", file)
      .expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return 403 Forbidden when USER tries to upload cover", async () => {
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent
      .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
      .expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to upload cover", async () => {
    const { body } = await req
      .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
      .expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`POST ${BASE_URL}/:id/reviews`, () => {
  it("should create a review when user is authenticated", async () => {
    const book = await createBook();
    const { reqAgent } = await loginWithUser("user");
    const review = generateReviewData();

    const { body } = await reqAgent
      .post(`${BASE_URL}/${book.id}/reviews`)
      .send(review)
      .expect(201);

    expect(body).toMatchObject({
      id: expect.any(String),
      rating: expect.any(Number),
      comment: expect.any(String),
      bookId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should return 400 BadRequest when body is invalid", async () => {
    const book = await createBook();
    const { reqAgent } = await loginWithUser("user");
    const review = generateReviewData({
      rating: 6,
      comment: "",
    });

    const { body } = await reqAgent
      .post(`${BASE_URL}/${book.id}/reviews`)
      .send(review)
      .expect(400);
    const errors = body.errors.map((e: object) => Object.keys(e)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("rating");
    expect(errors).toContain("comment");
  });

  it("should return 401 Unauthorized when user is not authenticated", async () => {
    const book = await createBook();
    const review = generateReviewData();

    const { body } = await req
      .post(`${BASE_URL}/${book.id}/reviews`)
      .send(review)
      .expect(401);

    expect(body).toHaveProperty("message");
  });

  it("should return 404 NotFound when book does not exist", async () => {
    const { reqAgent } = await loginWithUser("user");
    const review = generateReviewData();
    const UUID = crypto.randomUUID();

    const { body } = await reqAgent
      .post(`${BASE_URL}/${UUID}/reviews`)
      .send(review)
      .expect(404);

    expect(body).toHaveProperty("message");
  });
});

describe(`PUT ${BASE_URL}/:id`, () => {
  it("should return 200 and update book when ADMIN sends valid data", async () => {
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

  it("should return 400 BadRequest when ADMIN sends invalid fields", async () => {
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

  it("should return 404 NotFound when ADMIN tries to update non-existent book", async () => {
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

  it("should return 403 Forbidden when USER tries to update a book", async () => {
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

  it("should return 401 Unauthorized when unauthenticated user tries to update a book", async () => {
    const { body } = await req.put(BASE_URL + "/1234").expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`DELETE ${BASE_URL}/:id`, () => {
  it("should return 204 and delete book when ADMIN sends valid ID", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const book = await createBook();

    await reqAgent.delete(BASE_URL + "/" + book.id).expect(204);
  });

  it("should return 400 BadRequest when ADMIN sends invalid UUID", async () => {
    const { reqAgent } = await loginWithUser("admin");

    const { body } = await reqAgent
      .delete(BASE_URL + "/invalid-uuid")
      .expect(400);

    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("errors");
  });

  it("should return 404 NotFound when ADMIN tries to delete non-existent book", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();

    const { body } = await reqAgent.delete(BASE_URL + "/" + UUID).expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return 403 Forbidden when USER tries to delete a book", async () => {
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.delete(BASE_URL + "/1234").expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to delete a book", async () => {
    const { body } = await req
      .delete(BASE_URL + "/" + "invalid-uuid")
      .expect(401);

    expect(body).toHaveProperty("message");
  });
});
