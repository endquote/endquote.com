import type { Prisma } from "@prisma/client";
import { db } from "./shared";

export async function main() {
  const homes: Array<Prisma.homeCreateInput> = [
    {
      name: "Seattle",
      lat: 47.61683256703408,
      lng: -122.31372739105129,
      start: new Date("1997-06-01T00:00:00Z"),
      end: new Date("2015-04-16T01:53:00Z"),
      airports: ["SEA"],
    },
    {
      name: "San Francisco",
      lat: 37.78579877626331,
      lng: -122.48713449547435,
      start: new Date("2015-04-16T03:50:00Z"),
      end: new Date("2079-01-01T00:00:00Z"),
      airports: ["SFO", "OAK"],
    },
  ];

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
