import type { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { cacheUrl, db, readString } from "./shared";

config();

export const main = async () => {
  const url = "https://raw.githubusercontent.com/lxndrblz/Airports/main/airports.csv";
  await cacheUrl(url, "airports.csv");

  const airportsContent = await readString("airports.csv");
  const records = parse(airportsContent, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    // skip records without a code
    if (!record.code) continue;

    const airport: Prisma.airportCreateInput = {
      code: record.code,
      icao: record.icao || null,
      name: record.name,
      latitude: parseFloat(record.latitude) || 0,
      longitude: parseFloat(record.longitude) || 0,
      elevation: record.elevation ? parseInt(record.elevation) : null,
      url: record.url || null,
      timezone: record.time_zone || null,
      city: record.city || null,
      country: record.country || "",
      state: record.state || null,
      county: record.county || null,
    };

    // upsert to handle any duplicates
    await db.airport.upsert({
      where: { code: airport.code },
      update: airport,
      create: airport,
    });
  }
};

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
