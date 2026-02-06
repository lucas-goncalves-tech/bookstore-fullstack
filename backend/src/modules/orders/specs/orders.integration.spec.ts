import { describe, expect, it } from "vitest";
import { createBook } from "../../../tests/factories/book.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import { req } from "../../../tests/helpers/commom.helper";
import { prisma_test } from "../../../tests/setup";
import { createOrderWithItem } from "../../../tests/factories/order.factory";

const BASE_URL = "/api/v1/orders";

describe(`POST ${BASE_URL}`, () => {
  it("should return 201 and create order when user sends valid items with sufficient stock", async () => {
    const book = await createBook({
      stock: 2,
    });
    const order = [
      {
        id: book.id,
        quantity: 2,
      },
    ];

    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.post(BASE_URL).send(order).expect(201);

    expect(body).toHaveProperty("message");
  });

  it("should drecrement book stock when order is created", async () => {
    const book = await createBook({
      stock: 10,
    });
    const order = [
      {
        id: book.id,
        quantity: 3,
      },
    ];

    const { reqAgent } = await loginWithUser("user");

    await reqAgent.post(BASE_URL).send(order).expect(201);

    const updatedBook = await prisma_test.book.findUnique({
      where: { id: book.id },
    });

    expect(updatedBook?.stock).toBe(7);
  });

  it("should return 400 badRequest when order is invalid", async () => {
    const order = [
      {
        id: "invalid-id",
        quantity: -1,
      },
    ];

    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.post(BASE_URL).send(order).expect(400);
    const errors = body.errors.map((error: object) => Object.keys(error)[0]);
    expect(errors).toContain("[0]quantity");
    expect(errors).toContain("[0]id");
  });

  it("should return 400 BadRequest when order is empty array", async () => {
    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.post(BASE_URL).send([]).expect(400);

    expect(body).toHaveProperty("message");
  });

  it("should return 409 Conflict when order quantity exceeds available stock", async () => {
    const book = await createBook({
      stock: 2,
    });
    const order = [
      {
        id: book.id,
        quantity: 3,
      },
    ];

    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.post(BASE_URL).send(order).expect(409);

    expect(body).toHaveProperty("message");
  });

  it("should allow only one order to succeed when two users order the last item simultaneously", async () => {
    const book = await createBook({
      stock: 1,
    });
    const order = [
      {
        id: book.id,
        quantity: 1,
      },
    ];

    const { reqAgent } = await loginWithUser("user");
    const { reqAgent: reqAgentSecond } = await loginWithUser("user-second");

    const [responseUser, responseUserSecond] = await Promise.all([
      reqAgent.post(BASE_URL).send(order),
      reqAgentSecond.post(BASE_URL).send(order),
    ]);
    const status = [responseUser.status, responseUserSecond.status].sort();
    const updatedBook = await prisma_test.book.findUnique({
      where: { id: book.id },
    });
    expect(status).toEqual([201, 409]);
    expect(updatedBook?.stock).toBe(0);
  });

  it("should handle 10 concurrent orders correctly (stress test)", async () => {
    const book = await createBook({ stock: 1 });
    const order = [{ id: book.id, quantity: 1 }];

    const { reqAgent } = await loginWithUser("user");

    const responses = await Promise.all(
      Array.from({ length: 10 }, (_) => reqAgent.post(BASE_URL).send(order)),
    );

    const successCount = responses.filter((r) => r.status === 201).length;
    const failCount = responses.filter((r) => r.status === 409).length;

    expect(successCount).toBe(1);
    expect(failCount).toBe(9);
  });

  it("should return 401 Unauthorized when nonauthenticated user tries to create an order", async () => {
    const { body } = await req.post(BASE_URL).expect(401);

    expect(body).toHaveProperty("message");
  });

  it("should return 404 NotFound when order contains non-existent book ID", async () => {
    const UUID = crypto.randomUUID();
    const order = [
      {
        id: UUID,
        quantity: 2,
      },
    ];

    const { reqAgent } = await loginWithUser("user");

    const { body } = await reqAgent.post(BASE_URL).send(order).expect(404);

    expect(body).toHaveProperty("message");
  });
});

describe(`GET ${BASE_URL}`, () => {
  it("should return list with orders,orderItems and books when user is authenticated", async () => {
    const { reqAgent, user } = await loginWithUser("user");
    const book = await createBook({ stock: 3 });
    await createOrderWithItem({
      userId: user.id,
      bookId: book.id,
      quantity: 3,
      priceAtTime: book.price,
    });

    const { body } = await reqAgent.get(BASE_URL).expect(200);

    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({
      id: expect.any(String),
      userId: expect.any(String),
      total: expect.any(String),
      status: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should return 401 Unauthorized when nonauthenticated user tries to get orders", async () => {
    const { body } = await req.get(BASE_URL).expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`GET ${BASE_URL}/:id`, () => {
  it("should return order,orderItems and books when user is authenticated", async () => {
    const { reqAgent, user } = await loginWithUser("user");
    const book = await createBook({ stock: 3 });
    const order = await createOrderWithItem({
      userId: user.id,
      bookId: book.id,
      quantity: 3,
      priceAtTime: book.price,
    });

    const { body } = await reqAgent.get(`${BASE_URL}/${order.id}`).expect(200);

    expect(body).toMatchObject({
      id: expect.any(String),
      userId: expect.any(String),
      total: expect.any(String),
      status: expect.any(String),
      createdAt: expect.any(String),
    });
    expect(body.orderItem[0]).toMatchObject({
      quantity: expect.any(Number),
      priceAtTime: expect.any(String),
      book: {
        id: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
        coverThumbUrl: null,
        category: null,
      },
    });
  });

  it("should return 404 NotFound when order is not found", async () => {
    const { reqAgent } = await loginWithUser("user");
    const { body } = await reqAgent
      .get(`${BASE_URL}/${crypto.randomUUID()}`)
      .expect(404);

    expect(body).toHaveProperty("message");
  });
});
