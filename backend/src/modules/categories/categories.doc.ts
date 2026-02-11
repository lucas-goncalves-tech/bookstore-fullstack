import {
  badRequestResponse,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import {
  categoryFindManyResponseSchema,
  categoryResponseSchema,
  createCategoryDto,
  updateCategoryDto,
} from "./dtos/category.dto";

registry.registerPath({
  method: "get",
  path: "/categories",
  tags: ["Categories"],
  summary: "Listagem de categorias",
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: categoryFindManyResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/categories",
  tags: ["Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Criação de categoria (ADMIN)",
  description: "Cria uma nova categoria, Apenas para administradores.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCategoryDto,
          example: {
            name: "Category Name",
            slug: "category-slug",
            description: "Category Description",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: categoryResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "put",
  path: "/categories/{id}",
  tags: ["Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Atualização de categoria (ADMIN)",
  description: "Atualiza uma categoria, Apenas para administradores.",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateCategoryDto,
          example: {
            name: "Category Name",
            slug: "category-slug",
            description: "Category Description",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: categoryResponseSchema,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/categories/{id}",
  tags: ["Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Deletar categoria (ADMIN)",
  description: "Deleta uma categoria, Apenas para administradores.",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    204: {
      description: "Sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
