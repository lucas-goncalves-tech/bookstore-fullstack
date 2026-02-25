import { beforeEach, describe, expect, it } from "vitest";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { req } from "../../../tests/helpers/commom.helper";
import { Decimal } from "@prisma/client/runtime/library";
import { createBook } from "../../../tests/factories/book.factory";
import { expectecBookShape } from "../../../tests/helpers/book.helper";

describe("BooksIntegration", () => {
  const BASE_URL = "/api/v1/books";

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

    it("returns paginated books with default limit of 10", async () => {
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

    it("returns remaining items when requesting page 2", async () => {
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

    it("returns paginated books when custom limit is provided", async () => {
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

    it("returns empty array when page exceeds total pages", async () => {
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

    it("returns filtered books when search query matches title", async () => {
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
    it("returns filtered paginated books when combining search with pagination", async () => {
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

      const { body } = await req.get(BASE_URL + "?minPrice=20").expect(200);

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
