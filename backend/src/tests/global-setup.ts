import "reflect-metadata";

import { execSync } from "node:child_process";
import { env } from "../core/config/env";
import { container } from "tsyringe";
import { PrismaDB } from "../database/prisma";
import { PrismaClient } from "../database/generated/prisma";

export const prisma_test = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_TEST_URL,
    },
  },
});

export default async () => {
  try {
    execSync(
      `DATABASE_URL=${env.DATABASE_TEST_URL} npx prisma db push --accept-data-loss --skip-generate`,
      {
        stdio: "inherit",
      },
    );
    container.register(PrismaDB, { useValue: prisma_test });
  } catch (err) {
    //eslint-disable-next-line
    console.error("Error ao sincronizar banco durante teste: ", err);
    process.exit(1);
  }
};
