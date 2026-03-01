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
import { expectecBookShape } from "../../../../tests/helpers/book.helper";

describe("AdminBooksIntegration", () => {
  const BASE_URL = "/api/v1/admin/books";

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

  describe(`GET ${BASE_URL}`, () => {
    it("returns books that are out of stock or soft-deleted when ADMIN calls api", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const activeBook = await createBook({ title: "Livro Ativo", stock: 10 });
      const deletedBook = await createBook({
        title: "Livro Deletado",
        stock: 10,
        deletedAt: new Date(),
      });
      const noStockBook = await createBook({
        title: "Livro Sem Estoque",
        stock: 0,
      });

      const { body } = await reqAgent.get(BASE_URL).expect(200);

      const returnedIds = body.data.map((b: Book) => b.id);
      expect(returnedIds).toContain(deletedBook.id);
      expect(returnedIds).toContain(noStockBook.id);
      expect(returnedIds).toContain(activeBook.id);
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");
      const { body } = await reqAgent.get(BASE_URL).expect(403);
      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.get(BASE_URL).expect(401);
      expect(body).toHaveProperty("message");
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it("creates a book when data is valid", async () => {
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

    it("returns 400 for invalid fields", async () => {
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

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");
      const newBook = generateNewBook();

      const { body } = await reqAgent.post(BASE_URL).send(newBook).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const newBook = generateNewBook();

      const { body } = await req.post(BASE_URL).send(newBook).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`POST ${BASE_URL}/:id/cover`, () => {
    it("uploads a cover when image is valid", async () => {
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

    it("returns 400 when no file is attached", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const book = await createBook();

      const { body } = await reqAgent
        .post(BASE_URL + "/" + book.id + "/cover")
        .expect(400);

      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("errors");
    });

    it("returns 400 when file type is not allowed (only jpeg, jpg, png, webp)", async () => {
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

    it("returns 404 when book does not exist", async () => {
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

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
        .expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req
        .post(BASE_URL + "/" + "invalid-uuid" + "/cover")
        .expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`PUT ${BASE_URL}/:id`, () => {
    it("updates the book when data is valid", async () => {
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

    it("returns 400 for invalid fields", async () => {
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

    it("returns 404 when book does not exist", async () => {
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

    it("returns 403 for unauthorized roles", async () => {
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

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.put(BASE_URL + "/1234").expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`PATCH ${BASE_URL}/:id/restore`, () => {
    it("restores the book when id is valid", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const book = await createBook({
        deletedAt: new Date(),
      });

      await reqAgent.patch(BASE_URL + "/" + book.id + "/restore").expect(204);

      const bookFromDb = await prisma_test.book.findUnique({
        where: {
          id: book.id,
        },
      });
      expect(bookFromDb?.deletedAt).toBeFalsy();
    });

    it("returns 400 when id is invalid", async () => {
      const { reqAgent } = await loginWithUser("admin");

      const { body } = await reqAgent
        .patch(BASE_URL + "/invalid-uuid/restore")
        .expect(400);

      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("errors");
    });

    it("returns 404 when book does not exist", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .patch(BASE_URL + "/" + UUID + "/restore")
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent
        .patch(BASE_URL + "/1234/restore")
        .expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.patch(BASE_URL + "/1234/restore").expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it("deletes the book when id is valid", async () => {
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

    it("returns 400 when id is invalid", async () => {
      const { reqAgent } = await loginWithUser("admin");

      const { body } = await reqAgent
        .delete(BASE_URL + "/invalid-uuid")
        .expect(400);

      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("errors");
    });

    it("returns 404 when book does not exist", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent.delete(BASE_URL + "/" + UUID).expect(404);

      expect(body).toHaveProperty("message");
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");

      const { body } = await reqAgent.delete(BASE_URL + "/1234").expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req
        .delete(BASE_URL + "/" + "invalid-uuid")
        .expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
