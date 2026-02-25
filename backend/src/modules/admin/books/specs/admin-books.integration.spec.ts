import { describe, expect, it } from "vitest";
import { createCategory } from "../../../../tests/factories/categorie.factory";
import { req } from "../../../../tests/helpers/commom.helper";
import { Book } from "@prisma/client";
import { createBook } from "../../../../tests/factories/book.factory";
import { Decimal } from "@prisma/client/runtime/library";
import { ICreateBookInput } from "../../../books/interface/books.interface";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import path from "node:path";
import { prisma_test } from "../../../../tests/setup";

describe("AdminBooksIntegration", () => {
  const BASE_URL = "/api/v1/admin/books";

  function expectecBookShape(): Book {
    return {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      author: expect.any(String),
      price: expect.any(String),
      stock: expect.any(Number),
      coverUrl: expect.toSatisfy((v) => v === null || typeof v === "string"),
      coverThumbUrl: expect.toSatisfy(
        (v) => v === null || typeof v === "string",
      ),
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

  describe(`POST ${BASE_URL}`, () => {
    it("should return 201 and create book when ADMIN sends valid data", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const newBook = await generateNewBook();

      const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject(expectecBookShape());
      expect(body.data.title).toBe(newBook.title);
      expect(body.data.author).toBe(newBook.author);

      const book = await prisma_test.book.findUnique({
        where: {
          id: body.data.id,
        },
      });
      expect(book).toBeTruthy();
      expect(book?.title).toEqual(newBook.title);
      expect(book?.author).toEqual(newBook.author);
      expect(book?.description).toEqual(newBook.description);
      expect(Number(book?.price)).toEqual(Number(newBook.price));
      expect(book?.stock).toEqual(newBook.stock);
      expect(book?.categoryId).toEqual(newBook.categoryId);
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

      const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(400);
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
      const coverPath = path.resolve(
        __dirname,
        "../../../books/specs/fixtures/valid-size.jpg",
      );

      const { body } = await reqAgent
        .post(BASE_URL + "/" + book.id + "/cover")
        .attach("cover", coverPath)
        .expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject({
        coverUrl: expect.any(String),
        coverThumbUrl: expect.any(String),
      });

      const bookFromDb = await prisma_test.book.findUnique({
        where: {
          id: book.id,
        },
      });
      expect(bookFromDb).toBeTruthy();
      expect(bookFromDb?.coverUrl).toEqual(body.data.coverUrl);
      expect(bookFromDb?.coverThumbUrl).toEqual(body.data.coverThumbUrl);
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
      const coverPath = path.resolve(
        __dirname,
        "../../../books/specs/fixtures/invalid-type.gif",
      );

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
      const file = path.resolve(
        __dirname,
        "../../../books/specs/fixtures/valid-size.jpg",
      );

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

      const bookFromDb = await prisma_test.book.findUnique({
        where: {
          id: book.id,
        },
      });
      expect(bookFromDb).toBeTruthy();
      expect(bookFromDb?.title).toEqual(updatedBook.title);
      expect(bookFromDb?.author).toEqual(updatedBook.author);
      expect(bookFromDb?.description).toEqual(updatedBook.description);
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
    it("should return 204 and soft delete book when ADMIN sends valid ID", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const book = await createBook();

      await reqAgent.delete(BASE_URL + "/" + book.id).expect(204);

      const bookFromDb = await prisma_test.book.findUnique({
        where: {
          id: book.id,
        },
      });
      expect(bookFromDb?.deletedAt).toBeTruthy();
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
});
