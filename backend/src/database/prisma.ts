import { singleton } from "tsyringe";
import { PrismaClient } from "@prisma/client";

@singleton()
export class PrismaDB extends PrismaClient {
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    });
  }
}
