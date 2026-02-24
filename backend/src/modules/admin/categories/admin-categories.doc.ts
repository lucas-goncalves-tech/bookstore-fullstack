import {
  badRequestResponse,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import {
  findCategoryById,
  createCategoryDto,
  updateCategoryDto,
} from "../../categories/dtos/category.dto";

registry.registerPath({
  method: "post",
  path: "/admin/categories",
  tags: ["Admin - Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Criação de categoria",
  description: "Cria uma nova categoria.",
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
          schema: findCategoryById,
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
  path: "/admin/categories/{id}",
  tags: ["Admin - Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Atualização de categoria",
  description: "Atualiza uma categoria.",
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
          schema: findCategoryById,
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
  path: "/admin/categories/{id}",
  tags: ["Admin - Categories"],
  security: [{ cookieAuth: [] }],
  summary: "Deletar categoria",
  description: "Deleta uma categoria.",
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
