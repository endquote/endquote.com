import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { DateTime } from "luxon";
import { cacheUrl, db, readString, s3 } from "./shared";

config();

const main = async () => {
  const tzMap = await getTzMap();
  const flightRows = await getFlightRows();
  for (const row of flightRows) {
    const flight = parseFlight(row, tzMap);
    await db.flight.upsert({
      where: { flightyId: flight.flightyId },
      update: flight,
      create: flight,
    });
  }
};

// download a mapping of airport codes to time zones
// https://www.fresse.org/dateutils/tzmaps.html
const getTzMap = async () => {
  const tzmapUrl = "https://raw.githubusercontent.com/hroptatyr/dateutils/tzmaps/iata.tzmap";
  await cacheUrl(tzmapUrl, "iata.tsv");

  const tzmapContents = await readString("iata.tsv");
  return tzmapContents
    .split("\n")
    .map((line) => line.split("\t"))
    .reduce((acc, [code, zone]) => {
      acc[code] = zone;
      return acc;
    }, {});
};

// download the export from flighty
const getFlightRows = async () => {
  const params = { Bucket: process.env.S3_BUCKET, Key: "FlightyExport.csv" };
  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  const bodyContents = await response.Body.transformToString();
  const records = parse(bodyContents, { columns: true, skip_empty_lines: true });
  return records;
};

// convert the csv row to the prisma schema
const parseFlight = (row: any, tzMap: Record<string, string>): Prisma.flightCreateInput => {
  const obj = {
    flightyId: row["Flight Flighty ID"],
    date: row["Date"],
    airline: row["Airline"],
    flightNumber: row["Flight"],
    fromAirport: row["From"],
    toAirport: row["To"],
    departureTerminal: row["Dep Terminal"] || null,
    departureGate: row["Dep Gate"] || null,
    arrivalTerminal: row["Arr Terminal"] || null,
    arrivalGate: row["Arr Gate"] || null,
    canceled: row["Canceled"] === "true",
    divertedTo: row["Diverted To"] || null,
    scheduledDeparture: row["Gate Departure (Scheduled)"],
    actualDeparture: row["Gate Departure (Actual)"],
    scheduledTakeoff: row["Take off (Scheduled)"],
    actualTakeoff: row["Take off (Actual)"],
    scheduledLanding: row["Landing (Scheduled)"],
    actualLanding: row["Landing (Actual)"],
    scheduledArrival: row["Gate Arrival (Scheduled)"],
    actualArrival: row["Gate Arrival (Actual)"],
    aircraftType: row["Aircraft Type Name"] || null,
    tailNumber: row["Tail Number"] || null,
    pnr: row["PNR"] || null,
    seat: row["Seat"] || null,
    seatType: row["Seat Type"] || null,
    cabinClass: row["Cabin Class"] || null,
    flightReason: row["Flight Reason"] || null,
    notes: row["Notes"] || null,
    airlineFlightyId: row["Airline Flighty ID"] || null,
    depAirportFlightyId: row["Departure Airport Flighty ID"] || null,
    arrAirportFlightyId: row["Arrival Airport Flighty ID"] || null,
    divAirportFlightyId: row["Diverted To Airport Flighty ID"] || null,
    aircraftFlightyId: row["Aircraft Type Flighty ID"] || null,
  };

  // the dates are in the local time of the airport, convert them to unix timestamps
  const timestamp = (date: string, tz: string): Date | null => {
    if (!date) {
      return null;
    }
    return DateTime.fromISO(date, { zone: tz }).toUTC().toJSDate();
  };

  obj.date = timestamp(obj.date, tzMap[obj.fromAirport]);
  obj.scheduledDeparture = timestamp(obj.scheduledDeparture, tzMap[obj.fromAirport]);
  obj.actualDeparture = timestamp(obj.actualDeparture, tzMap[obj.fromAirport]);
  obj.scheduledTakeoff = timestamp(obj.scheduledTakeoff, tzMap[obj.fromAirport]);
  obj.actualTakeoff = timestamp(obj.actualTakeoff, tzMap[obj.fromAirport]);
  obj.scheduledLanding = timestamp(obj.scheduledLanding, tzMap[obj.toAirport]);
  obj.actualLanding = timestamp(obj.actualLanding, tzMap[obj.toAirport]);
  obj.scheduledArrival = timestamp(obj.scheduledArrival, tzMap[obj.toAirport]);
  obj.actualArrival = timestamp(obj.actualArrival, tzMap[obj.toAirport]);

  return obj;
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
