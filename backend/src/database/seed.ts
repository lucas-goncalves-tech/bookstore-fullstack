import { PrismaClient } from "@prisma/client";
import { env } from "../core/config/env";
import bcrypt from "bcrypt";

const prisma_seed = new PrismaClient();

async function main() {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;
  const adminName = env.ADMIN_NAME;

  const hash = await bcrypt.hash(adminPassword, env.SALT);

  await prisma_seed.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: hash,
    },
  });

  //eslint-disable-next-line
  console.log(`Usuário Admin ${adminName} criado com sucesso!`);
}

main()
  .catch((err) => {
    //eslint-disable-next-line
    console.error(err);
    process.exit(1);
  })
  .finally(async () => await prisma_seed.$disconnect());
