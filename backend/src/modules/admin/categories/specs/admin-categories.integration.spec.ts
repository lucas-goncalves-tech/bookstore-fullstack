import { describe, it, expect } from "vitest";
import { req } from "../../../../tests/helpers/commom.helper";
import { createCategory } from "../../../../tests/factories/categorie.factory";
import { loginWithUser } from "../../../../tests/helpers/auth.helper";
import { ICreateCategoryInput } from "../../../categories/interface/categories.interface";
import { prisma_test } from "../../../../tests/setup";

const BASE_URL = "/api/v1/admin/categories";

function expectedCategoryShape() {
  return {
    id: expect.any(String),
    name: expect.any(String),
    slug: expect.any(String),
    description: expect.any(String),
  };
}

function generateCategory(
  overrides?: Partial<ICreateCategoryInput>,
): ICreateCategoryInput {
  return {
    name: "Ação",
    slug: "acao",
    description: "Livros de ação",
    ...overrides,
  };
}

describe("AdminCategoriesIntegration", () => {
  describe(`POST ${BASE_URL}`, () => {
    it("creates a category when data is valid", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const newCategory = generateCategory();

      const { body } = await reqAgent
        .post(BASE_URL)
        .send(newCategory)
        .expect(201);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject(expectedCategoryShape());

      const categoryFromDb = await prisma_test.category.findUnique({
        where: {
          id: body.data.id,
        },
      });
      expect(categoryFromDb).toBeTruthy();
      expect(categoryFromDb?.name).toEqual(newCategory.name);
      expect(categoryFromDb?.slug).toEqual(newCategory.slug);
      expect(categoryFromDb?.description).toEqual(newCategory.description);
    });

    it("returns 400 for invalid fields", async () => {
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

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");
      const { body } = await reqAgent.post(BASE_URL).expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.post(BASE_URL).expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`PUT ${BASE_URL}/:id`, () => {
    it("updates the category when data is valid", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const category = await createCategory();
      const newCategory = generateCategory({
        name: "Ação 2",
        slug: "acao-2",
        description: "Descrição da categoria 2",
      });

      const { body } = await reqAgent
        .put(BASE_URL + "/" + category.id)
        .send(newCategory)
        .expect(200);

      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject(expectedCategoryShape());
      expect(body.data.name).toBe(newCategory.name);
      expect(body.data.slug).toBe(newCategory.slug);
      expect(body.data.description).toBe(newCategory.description);

      const categoryFromDb = await prisma_test.category.findUnique({
        where: {
          id: category.id,
        },
      });
      expect(categoryFromDb).toBeTruthy();
      expect(categoryFromDb?.name).toEqual(newCategory.name);
      expect(categoryFromDb?.slug).toEqual(newCategory.slug);
      expect(categoryFromDb?.description).toEqual(newCategory.description);
    });

    it("returns 400 for invalid fields", async () => {
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

    it("returns 404 when category does not exist", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const newCategory = generateCategory();
      const UUID = crypto.randomUUID();

      const { body } = await reqAgent
        .put(BASE_URL + "/" + UUID)
        .send(newCategory)
        .expect(404);

      expect(body).toHaveProperty("message");
    });

    it("returns 403 for unauthorized roles", async () => {
      const { reqAgent } = await loginWithUser("user");
      const { body } = await reqAgent.put(BASE_URL + "/1234").expect(403);

      expect(body).toHaveProperty("message");
    });

    it("returns 401 for unauthenticated requests", async () => {
      const { body } = await req.put(BASE_URL + "/1234").expect(401);

      expect(body).toHaveProperty("message");
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it("deletes the category when id is valid", async () => {
      const { reqAgent } = await loginWithUser("admin");
      const category = await createCategory();

      await reqAgent.delete(BASE_URL + "/" + category.id).expect(204);

      const categoryFromDb = await prisma_test.category.findUnique({
        where: {
          id: category.id,
        },
      });
      expect(categoryFromDb).toBeFalsy();
    });

    it("returns 404 when category does not exist", async () => {
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
      const { body } = await req.delete(BASE_URL + "/1234").expect(401);

      expect(body).toHaveProperty("message");
    });
  });
});
