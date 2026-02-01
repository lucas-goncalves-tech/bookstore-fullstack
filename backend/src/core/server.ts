import "reflect-metadata";

import { container } from "tsyringe";
import "./config/container"; // <-- Registra o StorageProvider ANTES de resolver App
import { env } from "./config/env";
import { App } from "../app";

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
