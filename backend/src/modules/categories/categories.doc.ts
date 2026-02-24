import { registry } from "../../docs/openapi.registry";
import { findManyCategoriesResponse } from "./dtos/category.dto";

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
          schema: findManyCategoriesResponse,
        },
      },
    },
  },
});
