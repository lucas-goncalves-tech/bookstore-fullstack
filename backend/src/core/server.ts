import "reflect-metadata";

import { App } from "@/app";
import { container } from "tsyringe";
import { env } from "./config/env";

const app = container.resolve(App).getServer();

const server = app.listen(env.PORT, () => {
  //eslint-disable-next-line
  console.log(`Server is running on port ${env.PORT}`);
});

const gracefulShutdown = () => {
  server.close(() => {
    process.exit(0);
  });
  server.closeAllConnections();
  setTimeout(() => {
    process.exit(1);
  }, 5_000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
