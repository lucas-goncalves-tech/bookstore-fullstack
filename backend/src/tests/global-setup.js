import { execSync } from "node:child_process";

export default async () => {
  try {
    const dbUrl =
      process.env.DATABASE_TEST_URL ||
      "postgresql://test:test@db_test:5432/bookstore_test";
    execSync(
      `DATABASE_URL=${dbUrl} npx prisma db push --accept-data-loss --skip-generate`,
      {
        stdio: "inherit",
      },
    );
  } catch (err) {
    //eslint-disable-next-line
    console.error("Error ao sincronizar banco durante teste: ", err);
    process.exit(1);
  }
};
