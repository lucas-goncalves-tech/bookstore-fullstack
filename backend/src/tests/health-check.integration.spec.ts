import supertest from "supertest";
import { container } from "tsyringe";
import { describe, expect, it } from "vitest";
import { App } from "../app";

describe("GET /health", () => {
  it("should return status 200", async () => {
    const app = container.resolve(App).getServer();
    const result = await supertest(app).get("/health");

    expect(result.status).toBe(200);
  });
});
