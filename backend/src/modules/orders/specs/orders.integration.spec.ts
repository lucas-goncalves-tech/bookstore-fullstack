import { describe, expect, it } from "vitest";
import { createBook } from "../../../tests/factories/book.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";

const BASE_URL = "/api/v1/orders";

describe(`POST ${BASE_URL}`, () => {
  it("should allow USER create a order with valid data", async () => {
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
});
