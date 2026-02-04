import { describe, it, expect } from "vitest";
import { req } from "../../../tests/helpers/commom.helper";
import { createCategory } from "../../../tests/factories/categorie.factory";
import { loginWithUser } from "../../../tests/helpers/auth.helper";
import { ICreateCategoryInput } from "../interface/categories.interface";

const BASE_URL = "/api/v1/categories";

function expectedCategoryShape() {
  return {
    id: expect.any(String),
    name: expect.any(String),
    slug: expect.any(String),
    description: expect.any(String),
  };
}

function generateCategory(): ICreateCategoryInput {
  return {
    name: "Ação",
    slug: "acao",
    description: "Livros de ação",
  };
}

describe(`GET ${BASE_URL}`, () => {
  it("should return 200 and list all categories when categories exist", async () => {
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

  it("should return 200 and empty array when no categories exist", async () => {
    const { body } = await req.get(BASE_URL).expect(200);
    expect(body).toHaveLength(0);
  });
});

describe(`POST ${BASE_URL}`, () => {
  it("should return 201 and create category when ADMIN sends valid data", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newCategory = generateCategory();

    const { body } = await reqAgent
      .post(BASE_URL)
      .send(newCategory)
      .expect(201);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectedCategoryShape());
  });

  it("should return 400 BadRequest when ADMIN sends invalid fields", async () => {
    const { reqAgent } = await loginWithUser("admin");

    const { body } = await reqAgent
      .post(BASE_URL)
      .send({
        name: "",
        slug: "AAAAA",
        description: "",
      })
      .expect(400);
    const errors = body.errors.map((err: object) => Object.keys(err)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("name");
    expect(errors).toContain("slug");
    expect(errors).toContain("description");
  });

  it("should return 403 Forbidden when USER tries to create a category", async () => {
    const { reqAgent } = await loginWithUser("user");
    const { body } = await reqAgent.post(BASE_URL).expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to create a category", async () => {
    const { body } = await req.post(BASE_URL).expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`PUT ${BASE_URL}/:id`, () => {
  it("should return 200 and update category when ADMIN sends valid data", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const category = await createCategory();
    const newCategory = generateCategory();

    const { body } = await reqAgent
      .put(BASE_URL + "/" + category.id)
      .send(newCategory)
      .expect(200);

    expect(body).toHaveProperty("message");
    expect(body.data).toMatchObject(expectedCategoryShape());
    expect(body.data.name).toBe(newCategory.name);
    expect(body.data.slug).toBe(newCategory.slug);
    expect(body.data.description).toBe(newCategory.description);
  });

  it("should return 400 BadRequest when ADMIN sends invalid fields", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const category = await createCategory();

    const { body } = await reqAgent
      .put(BASE_URL + "/" + category.id)
      .send({
        name: "",
        slug: "AAAAA",
        description: "",
      })
      .expect(400);
    const errors = body.errors.map((err: object) => Object.keys(err)[0]);

    expect(body).toHaveProperty("message");
    expect(errors).toContain("name");
    expect(errors).toContain("slug");
    expect(errors).toContain("description");
  });

  it("should return 404 NotFound when ADMIN tries to update non-existent category", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const newCategory = generateCategory();
    const UUID = crypto.randomUUID();

    const { body } = await reqAgent
      .put(BASE_URL + "/" + UUID)
      .send(newCategory)
      .expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return 403 Forbidden when USER tries to update a category", async () => {
    const { reqAgent } = await loginWithUser("user");
    const { body } = await reqAgent.put(BASE_URL + "/1234").expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to update a category", async () => {
    const { body } = await req.put(BASE_URL + "/1234").expect(401);

    expect(body).toHaveProperty("message");
  });
});

describe(`DELETE ${BASE_URL}/:id`, () => {
  it("should return 204 and delete category when ADMIN sends valid ID", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const category = await createCategory();

    await reqAgent.delete(BASE_URL + "/" + category.id).expect(204);
  });

  it("should return 404 NotFound when ADMIN tries to delete non-existent category", async () => {
    const { reqAgent } = await loginWithUser("admin");
    const UUID = crypto.randomUUID();

    const { body } = await reqAgent.delete(BASE_URL + "/" + UUID).expect(404);

    expect(body).toHaveProperty("message");
  });

  it("should return 403 Forbidden when USER tries to delete a category", async () => {
    const { reqAgent } = await loginWithUser("user");
    const { body } = await reqAgent.delete(BASE_URL + "/1234").expect(403);

    expect(body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized when unauthenticated user tries to delete a category", async () => {
    const { body } = await req.delete(BASE_URL + "/1234").expect(401);

    expect(body).toHaveProperty("message");
  });
});
