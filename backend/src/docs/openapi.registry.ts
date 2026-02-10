import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  SID_ACCESS_COOKIE,
  SID_REFRESH_COOKIE,
} from "../shared/contants/sid-cookie";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: SID_ACCESS_COOKIE,
  description: "JWT access token enviado automaticamente via cookie HTTP-only",
});

registry.registerComponent("securitySchemes", "refreshCookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: SID_REFRESH_COOKIE,
  description: "JWT refresh token enviado automaticamente via cookie HTTP-only",
});
