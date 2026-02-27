import { execSync } from "node:child_process";

export default async () => {

  try {
    for (let i = 1; i <= 4; i++) {
      const dburl = `${process.env.DATABASE_TEST_URL}?schema=test_${i}`;
      execSync(`npx prisma db push --accept-data-loss --skip-generate`, {
        env: {
          ...process.env,
          DATABASE_URL: dburl,
        },
        stdio: "inherit",
      });
    }
  } catch (err) {
    //eslint-disable-next-line
    console.error("Error ao sincronizar banco durante teste: ", err);
    process.exit(1);
  }
};
