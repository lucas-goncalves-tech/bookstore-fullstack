import { singleton } from "tsyringe";
import { PrismaClient } from "./generated/prisma";

@singleton()
export class PrismaDB extends PrismaClient {
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    });
  }
}
