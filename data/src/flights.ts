import { GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { db, s3 } from "./shared";

config();

const ts = (date: string | null): number | null => {
  if (!date) return null;
  return Math.floor(new Date(date + "Z").getTime() / 1000);
};

const transformRow = (row: any) => {
  return {
    flightyId: row["Flight Flighty ID"],
    date: ts(row["Date"]),
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
    scheduledDeparture: ts(row["Gate Departure (Scheduled)"]),
    actualDeparture: ts(row["Gate Departure (Actual)"]),
    scheduledTakeoff: ts(row["Take off (Scheduled)"]),
    actualTakeoff: ts(row["Take off (Actual)"]),
    scheduledLanding: ts(row["Landing (Scheduled)"]),
    actualLanding: ts(row["Landing (Actual)"]),
    scheduledArrival: ts(row["Gate Arrival (Scheduled)"]),
    actualArrival: ts(row["Gate Arrival (Actual)"]),
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
};

const main = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: "FlightyExport.csv",
  };
  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  const bodyContents = await response.Body.transformToString();

  const records = parse(bodyContents, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of records) {
    const flight = transformRow(record);
    await db.flight.upsert({
      where: { flightyId: flight.flightyId },
      update: flight,
      create: flight,
    });
  }
};

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
