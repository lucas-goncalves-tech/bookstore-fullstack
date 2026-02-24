import {
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../docs/errors/errors";
import { registry } from "../../../docs/openapi.registry";
import {
  dashboardDetailsResponse,
  dashboardSalesResponse,
} from "./dtos/dashboard.dto";

registry.registerPath({
  method: "get",
  path: "/admin/dashboard/details",
  tags: ["Admin - Dashboard"],
  security: [{ cookieAuth: [] }],
  summary: "Mostra os detalhes do dashboard",
  responses: {
    200: {
      description: "Todos os detalhes do dashboard",
      content: {
        "application/json": {
          schema: dashboardDetailsResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/admin/dashboard/sales",
  tags: ["Admin - Dashboard"],
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
          schema: dashboardSalesResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
