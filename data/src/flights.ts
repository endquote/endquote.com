import { GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { db, s3 } from "./shared";

config();

const transformRow = (row: any) => {
  return {
    flightyId: row["Flight Flighty ID"],
    date: new Date(row["Date"]),
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
    scheduledDeparture: row["Gate Departure (Scheduled)"] ? new Date(row["Gate Departure (Scheduled)"]) : null,
    actualDeparture: row["Gate Departure (Actual)"] ? new Date(row["Gate Departure (Actual)"]) : null,
    scheduledTakeoff: row["Take off (Scheduled)"] ? new Date(row["Take off (Scheduled)"]) : null,
    actualTakeoff: row["Take off (Actual)"] ? new Date(row["Take off (Actual)"]) : null,
    scheduledLanding: row["Landing (Scheduled)"] ? new Date(row["Landing (Scheduled)"]) : null,
    actualLanding: row["Landing (Actual)"] ? new Date(row["Landing (Actual)"]) : null,
    scheduledArrival: row["Gate Arrival (Scheduled)"] ? new Date(row["Gate Arrival (Scheduled)"]) : null,
    actualArrival: row["Gate Arrival (Actual)"] ? new Date(row["Gate Arrival (Actual)"]) : null,
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

const run = async () => {
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
  run();
}
