import {
  forbiddenResponse,
  unauthorizedResponse,
} from "../../docs/errors/errors";
import { registry } from "../../docs/openapi.registry";
import {
  dashboardDetailsSchema,
  dashboardSalesSchema,
} from "./dtos/dashboard.dto";

registry.registerPath({
  method: "get",
  path: "/dashboard/details",
  tags: ["Dashboard"],
  security: [{ cookieAuth: [] }],
  summary: "Mostra os detalhes do dashboard",
  responses: {
    200: {
      description: "Todos os detalhes do dashboard",
      content: {
        "application/json": {
          schema: dashboardDetailsSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/dashboard/sales",
  tags: ["Dashboard"],
  security: [{ cookieAuth: [] }],
  summary: "Mostra as ultimas vendas do BookStore",
  parameters: [
    {
      name: "page",
      in: "query",
      required: false,
      schema: {
        type: "integer",
      },
    },
  ],
  responses: {
    200: {
      description: "Todas as vendas do BookStore",
      content: {
        "application/json": {
          schema: dashboardSalesSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
