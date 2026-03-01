import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { Decimal } from "@prisma/client/runtime/library";
import { createBook } from "../../../tests/factories/book.factory";
import { expectecBookShape } from "../../../tests/helpers/book.helper";
import { Book } from "@prisma/client";

describe("BooksIntegration", () => {
  const BASE_URL = "/api/v1/books";

  describe(`GET ${BASE_URL} - Pagination`, () => {
    beforeEach(async () => {
      const { id } = await createCategory();

      await Promise.all(
        Array.from({ length: 6 }, () => {
          return createBook({
            categoryId: id,
          });
        }),
      );
    });

    it("returns paginated books with default limit of 10", async () => {
      const { body } = await req.get(BASE_URL).expect(200);

      expect(body.data).toHaveLength(6);
      expect(body.data[0]).toMatchObject(expectecBookShape());
      expect(body.metadata).toMatchObject({
        page: 1,
        limit: 10,
        total: 6,
        totalPages: 1,
      });
    });

    it("does NOT return books that are out of stock or soft-deleted", async () => {
      const activeBook = await createBook({ title: "Active Book", stock: 10 });

      const deletedBook = await createBook({
        title: "Deleted Book",
        stock: 10,
        deletedAt: new Date(),
      });
      const noStockBook = await createBook({
        title: "No Stock Book",
        stock: 0,
      });

      const { body } = await req.get(BASE_URL).expect(200);

      const returnedIds = body.data.map((b: Book) => b.id);
      expect(returnedIds).not.toContain(deletedBook.id);
      expect(returnedIds).not.toContain(noStockBook.id);

      expect(returnedIds).toContain(activeBook.id);
    });

    it("returns remaining items when requesting page 2", async () => {
      const page = 2;
      const limit = 5;

      const { body } = await req
        .get(BASE_URL)
        .query({ page, limit })
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toMatchObject(expectecBookShape());
      expect(body.metadata).toMatchObject({
        page,
        limit,
        total: 6,
        totalPages: 2,
      });
    });

    it("returns paginated books when custom limit is provided", async () => {
      const limit = 4;

      const { body } = await req.get(BASE_URL).query({ limit }).expect(200);

      expect(body.data).toHaveLength(4);
      expect(body.data[0]).toMatchObject(expectecBookShape());
      expect(body.metadata).toMatchObject({
        page: 1,
        limit,
        total: 6,
        totalPages: 2,
      });
    });

    it("returns empty array when page exceeds total pages", async () => {
      const page = 5;

      const { body } = await req.get(BASE_URL).query({ page }).expect(200);

      expect(body.data).toHaveLength(0);
      expect(body.metadata).toMatchObject({
        page,
        limit: 10,
        total: 6,
        totalPages: 1,
      });
    });
  });

  describe(`GET ${BASE_URL} - Filters`, () => {
    it("returns filtered books when categorySlug is provided", async () => {
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

      const categorySlug = adventure.slug;

      const { body } = await req
        .get(BASE_URL)
        .query({ categorySlug })
        .expect(200);

      expect(body.data).toHaveLength(5);
      expect(body.metadata).toMatchObject({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
      });
    });

    it("returns filtered books when search query matches title", async () => {
      const title = "Lord of the ring";

      await createBook({
        title: "The banana diary",
      });

      await createBook({
        title,
      });

      const search = title;

      const { body } = await req.get(BASE_URL).query({ search }).expect(200);

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
    it("returns filtered paginated books when combining search with pagination", async () => {
      const title = "Lord of the ring";
      for (let i = 1; i <= 6; i++) {
        await createBook({
          title,
        });
      }

      for (let i = 1; i <= 2; i++) {
        await createBook({
          title: "The banana diary",
        });
      }

      const search = title;
      const page = 2;
      const limit = 5;

      const { body } = await req
        .get(BASE_URL)
        .query({ search, page, limit })
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.metadata).toMatchObject({
        page,
        limit,
        total: 6,
        totalPages: 2,
      });
    });

    it("returns filtered books when minPrice is provided", async () => {
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

      const minPrice = 20;
      const { body } = await req.get(BASE_URL).query({ minPrice }).expect(200);

      expect(body.data).toHaveLength(10);
      expect(body.metadata).toMatchObject({
        page: 1,
        limit: 10,
        total: 10,
        totalPages: 1,
      });
    });

    it("returns filtered books when maxPrice is provided", async () => {
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

      const maxPrice = 10;
      const { body } = await req.get(BASE_URL).query({ maxPrice }).expect(200);

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
    it("returns book data when valid ID is provided", async () => {
      const book = await createBook();
      const { body } = await req.get(BASE_URL + "/" + book.id).expect(200);

      expect(body).toMatchObject(expectecBookShape());
      expect(body.id).toBe(book.id);
    });

    it("returns 404 when book ID does not exist", async () => {
      const UUID = crypto.randomUUID();
      const { body } = await req.get(BASE_URL + "/" + UUID).expect(404);

      expect(body).toHaveProperty("message");
    });

    it("returns 400 when ID is not a valid UUID", async () => {
      const { body } = await req.get(BASE_URL + "/invalid-uuid").expect(400);
      const errors = body.errors.map((e: object) => Object.keys(e)[0]);

      expect(body).toHaveProperty("message");
      expect(errors).toContain("id");
    });
  });
});
