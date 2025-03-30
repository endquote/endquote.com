import type { Prisma } from "@prisma/client";
import { HOMES } from "../app/utils/constants";
import { db } from "./shared";

export async function main() {
  const homes: Array<Prisma.homeCreateInput> = HOMES;
  for (const home of homes) {
    await db.home.upsert({
      where: { name: home.name },
      update: home,
      create: home,
    });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(async () => {
      await db.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
}
