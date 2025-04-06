import type { Prisma } from "@prisma/client";
import { HOMES } from "../app/utils/constants";
import { db } from "./shared";

export async function main() {
  for (const home of HOMES) {
    const { airports, ...homeData } = home;

    const homeInput: Prisma.homeCreateInput = {
      ...homeData,
      airports: {
        connect: airports.map((code) => ({ code })),
      },
    };

    await db.home.upsert({
      where: { name: homeData.name },
      update: homeInput,
      create: homeInput,
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
