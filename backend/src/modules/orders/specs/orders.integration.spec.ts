import { describe, expect, it } from "vitest";
import { createBook } from "../../../tests/factories/book.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";

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
    expect(status).toEqual([201, 409]);
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
