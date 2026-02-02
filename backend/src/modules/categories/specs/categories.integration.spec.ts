import { describe, it, expect } from "vitest";
import { req } from "../../../tests/helpers/commom.helper";
import { createCategory } from "../../../tests/factories/categorie.factory";

const BASE_URL = "/api/v1/categories";

function expectedCategoryShape() {
  return {
    id: expect.any(String),
    name: expect.any(String),
    slug: expect.any(String),
    description: expect.any(String),
  };
}

describe(`GET ${BASE_URL}`, () => {
  it("should return all categories", async () => {
    for (let i = 1; i <= 3; i++) {
      await createCategory({
        name: `Categoria ${i}`,
        slug: `categoria-${i}`,
        description: `Descrição da categoria ${i}`,
      });
    }
    const { body } = await req.get(BASE_URL).expect(200);
    expect(body).toHaveLength(3);
    expect(body[0]).toMatchObject(expectedCategoryShape());
  });

  it("should return empty array when no categories are created", async () => {
    const { body } = await req.get(BASE_URL).expect(200);
    expect(body).toHaveLength(0);
  });
});
