import { Prisma } from "@prisma/client";
import { db } from "./shared";

async function main() {
  const homes: Array<Prisma.homeCreateInput> = [
    {
      name: "Seattle",
      lat: 47.61683256703408,
      lng: -122.31372739105129,
      start: new Date("1997-06-01"),
      end: new Date("2015-03-20T23:59:59"),
      airports: ["SEA"],
    },
    {
      name: "San Francisco",
      lat: 37.78579877626331,
      lng: -122.48713449547435,
      start: new Date("2015-03-21"),
      end: new Date("2079-01-01"),
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

if (require.main === module) {
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
