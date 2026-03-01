import { describe, expect, it } from "vitest";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import { createBook } from "../../../../tests/factories/book.factory";
import { createOrderWithItem } from "../../../../tests/factories/order.factory";
import { DashboardSalesResponse } from "../dtos/dashboard.dto";
import { req } from "../../../../tests/helpers/commom.helper";

describe("DashboardIntegration", () => {
  const BASE_URL = "/api/v1/admin/dashboard";

  describe(`GET ${BASE_URL}/details`, () => {
    it("should return revenue, sales, totalUsers when is ADMIN", async () => {
      const { reqAgent, user } = await loginWithUser("admin");
      const quantity = 4;
      const book = await createBook({
        stock: quantity,
      });
      const order = await createOrderWithItem({
        userId: user.id,
        bookId: book.id,
        quantity,
        priceAtTime: book.price,
      });

      const { body } = await reqAgent.get(BASE_URL + "/details").expect(200);

      expect(body.totalUsers).toEqual(1);
      expect(body.revenue).toEqual(Number(order.total));
      expect(body.sales).toEqual(quantity);
    });

    it("should return revenue = 0 , sales = 0 when is ADMIN and don't have any sales", async () => {
      const { reqAgent } = await loginWithUser("admin");

      const { body } = await reqAgent.get(BASE_URL + "/details").expect(200);

      expect(body.revenue).toEqual(0);
      expect(body.sales).toEqual(0);
    });

    it("should return 403 when is not ADMIN", async () => {
      const { reqAgent } = await loginWithUser();

      await reqAgent.get(BASE_URL + "/details").expect(403);
    });

    it("should return 401 when is not authenticated", async () => {
      await req.get(BASE_URL + "/details").expect(401);
    });
  });

  describe(`GET ${BASE_URL}/sales`, () => {
    it("should return sales when is ADMIN", async () => {
      const { reqAgent, user } = await loginWithUser("admin");
      const quantity = 4;
      const book = await createBook({
        stock: quantity,
      });
      await createOrderWithItem({
        userId: user.id,
        bookId: book.id,
        quantity,
        priceAtTime: book.price,
      });

      const { body } = await reqAgent.get(BASE_URL + "/sales").expect(200);

      const expected: DashboardSalesResponse = {
        sales: [
          {
            id: expect.any(String),
            total: expect.any(String),
            status: expect.any(String),
            createdAt: expect.any(String),
            user: {
              name: expect.any(String),
            },
            orderItem: [
              {
                quantity: expect.any(Number),
                priceAtTime: expect.any(String),
                book: {
                  title: expect.any(String),
                  author: expect.any(String),
                  coverThumbUrl: null,
                },
              },
            ],
          },
        ],
        metadata: {
          page: 1,
          total: 1,
          totalPage: 1,
        },
      };

      expect(body.sales).toHaveLength(1);
      expect(body.sales[0]).toMatchObject(expected.sales[0]);
      expect(body.metadata).toMatchObject(expected.metadata);
    });

    it("should return sales when is ADMIN and pagination", async () => {
      const { reqAgent, user } = await loginWithUser("admin");
      const quantity = 4;
      const book = await createBook({
        stock: quantity,
      });
      await createOrderWithItem({
        userId: user.id,
        bookId: book.id,
        quantity,
        priceAtTime: book.price,
      });

      const page = 2;

      const { body } = await reqAgent
        .get(BASE_URL + "/sales")
        .query({ page })
        .expect(200);

      const expected: DashboardSalesResponse = {
        sales: [],
        metadata: {
          page,
          total: 1,
          totalPage: 1,
        },
      };

      expect(body.sales).toHaveLength(0);
      expect(body.metadata).toMatchObject(expected.metadata);
    });

    it("should return 403 when is not ADMIN", async () => {
      const { reqAgent } = await loginWithUser();

      await reqAgent.get(BASE_URL + "/sales").expect(403);
    });

    it("should return 401 when is not authenticated", async () => {
      await req.get(BASE_URL + "/sales").expect(401);
    });
  });
});
