import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
    },
    globalSetup: ["./src/tests/global-setup.js"],
    setupFiles: ["./src/tests/setup.ts"],
    env: {
      NODE_ENV: "test",
    },
    maxWorkers: 1,
  },
});
