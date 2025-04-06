import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { DateTime } from "luxon";
import { db, s3 } from "./shared";

config();

const main = async () => {
  const airportTzs = await getAirportTimezones();
  const flightRows = await getFlightRows();
  await db.flight.deleteMany();

  for (const row of flightRows) {
    const flight = parseFlight(row, airportTzs);
    await db.flight.upsert({
      where: { flightyId: flight.flightyId },
      update: flight,
      create: flight,
    });
  }
};

// get airport timezones from database
const getAirportTimezones = async (): Promise<Record<string, string>> => {
  const airports = await db.airport.findMany({
    select: { code: true, timezone: true },
  });

  return airports.reduce(
    (acc, airport) => {
      acc[airport.code] = airport.timezone || "UTC";
      return acc;
    },
    {} as Record<string, string>,
  );
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
    departureTerminal: row["Dep Terminal"] || null,
    departureGate: row["Dep Gate"] || null,
    arrivalTerminal: row["Arr Terminal"] || null,
    arrivalGate: row["Arr Gate"] || null,
    canceled: row["Canceled"] === "true",
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

    // connect to airport models
    fromAirport: { connect: { code: row["From"] } },
    toAirport: { connect: { code: row["To"] } },
    divertedToAirport: row["Diverted To"] ? { connect: { code: row["Diverted To"] } } : undefined,
  };

  // the dates are in the local time of the airport, convert them to unix timestamps
  const timestamp = (date: string, tz: string): Date | null => {
    if (!date) {
      return null;
    }
    return DateTime.fromISO(date, { zone: tz }).toUTC().toJSDate();
  };

  obj.date = timestamp(obj.date, tzMap[row["From"]]);
  obj.scheduledDeparture = timestamp(obj.scheduledDeparture, tzMap[row["From"]]);
  obj.actualDeparture = timestamp(obj.actualDeparture, tzMap[row["From"]]);
  obj.scheduledTakeoff = timestamp(obj.scheduledTakeoff, tzMap[row["From"]]);
  obj.actualTakeoff = timestamp(obj.actualTakeoff, tzMap[row["From"]]);
  obj.scheduledLanding = timestamp(obj.scheduledLanding, tzMap[row["To"]]);
  obj.actualLanding = timestamp(obj.actualLanding, tzMap[row["To"]]);
  obj.scheduledArrival = timestamp(obj.scheduledArrival, tzMap[row["To"]]);
  obj.actualArrival = timestamp(obj.actualArrival, tzMap[row["To"]]);

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
