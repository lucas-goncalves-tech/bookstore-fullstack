import { defineConfig } from "vitest/config";
import { env } from "./src/core/config/env";
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
    },
    setupFiles: ["./src/tests/setup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL:
        env.DATABASE_TEST_URL ||
        "postgresql://test:test@db_test:5434/bookstore_test",
    },
  },
});
