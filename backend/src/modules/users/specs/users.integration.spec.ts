import { describe, it, expect } from "vitest";
import { loginWithUser } from "../../../tests/helpers/auth.helper";

describe("Users Integration Tests", () => {
  const BASE_URL = "/api/v1/users";
  describe(`GET ${BASE_URL}`, () => {
    it("should return user data", async () => {
      const { reqAgent } = await loginWithUser();

      const { body } = await reqAgent.get(BASE_URL + "/me").expect(200);
      expect(body).toMatchObject({
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String),
      });
      expect(body).not.toHaveProperty("id");
      expect(body).not.toHaveProperty("password");
      expect(body).not.toHaveProperty("password_hash");
    });
  });
});
