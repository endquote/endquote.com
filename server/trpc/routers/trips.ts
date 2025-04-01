import type { Prisma } from "@prisma/client";
import fs from "fs";
import { fileURLToPath } from "url";
import { z } from "zod";
import useDev from "~/composables/useDev";
import prisma from "~~/lib/prisma";
import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";
import { s3Router } from "~~/server/trpc/routers/s3";

// use the same select query for both trips queries
const tripSelect = {
  eqId: true,
  start: true,
  end: true,
  checkins: {
    select: {
      fsId: true,
      date: true,
      flight: {
        select: {
          fromAirport: true,
          toAirport: true,
          canceled: true,
        },
      },
      venue: {
        select: {
          fsId: true,
          name: true,
          airport: true,
          llmIcon: true,
          restaurant: {
            select: {
              award: true,
              url: true,
            },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  },
  flights: {
    select: {
      flightyId: true,
      canceled: true,
      date: true,
      fromAirport: true,
      toAirport: true,
      actualDeparture: true,
      scheduledDeparture: true,
    },
  },
} satisfies Prisma.tripSelect;

// process the trip result before returning
const processTrip = (trip: Prisma.tripGetPayload<{ select: typeof tripSelect }>) => {
  return {
    ...trip,
    flights: trip.flights.map((flight) => ({
      // removing some fields that wouldn't be useful in the client
      eqId: flight.flightyId,
      canceled: flight.canceled,
      fromAirport: flight.fromAirport,
      toAirport: flight.toAirport,
      // make a canonical date for display
      date: (flight.actualDeparture || flight.scheduledDeparture || flight.date).toISOString(),
    })),
  };
};

// get the possible checkin icons
const iconMetaPath = fileURLToPath(import.meta.resolve("@iconify-json/material-symbols/metadata.json"));
const iconMetaText = fs.readFileSync(iconMetaPath, "utf-8");
const iconMetaData = JSON.parse(iconMetaText);
const categories = ["Activities", "Business", "Maps", "Transit", "Travel"];
const suffixes = Object.keys(iconMetaData.suffixes).filter((s) => s);
const icons: Record<string, string[]> = {};
for (const category of categories) {
  icons[category] = iconMetaData.categories[category].filter(
    (i: string) => !suffixes.some((suffix) => i.endsWith(suffix)),
  );
}

export const tripsRouter = createTRPCRouter({
  // return all trips that have an associated page
  // in dev mode, return all trips
  trips: baseProcedure.query(async () => {
    let where = {} satisfies Prisma.tripWhereInput;
    if (!useDev()) {
      const pages = await queryCollection(useEvent(), "trips").select("date").all();
      const pageDates = pages.map((page) => page.date.split("T")[0]);
      where = {
        OR: pageDates.map((date) => ({
          start: {
            gte: new Date(date + "T00:00:00.000Z"),
            lte: new Date(date + "T23:59:59.999Z"),
          },
        })),
      };
    }

    const trips = await prisma.trip.findMany({
      where,
      select: tripSelect,
      orderBy: { start: "desc" },
    });

    return trips.map(processTrip);
  }),

  // return a single trip by start date
  trip: baseProcedure
    .input(
      z.object({
        date: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // only return trips that have an associated page
      if (!useDev()) {
        const page = await queryCollection(useEvent(), "trips").where("date", "LIKE", `${input.date}%`).first();
        if (!page) {
          return null;
        }
      }

      let trip = await prisma.trip.findFirst({
        select: tripSelect,
        orderBy: { start: "asc" },
        where: {
          start: {
            gte: new Date(input.date + "T00:00:00.000Z"),
            lt: new Date(input.date + "T24:00:00.000Z"),
          },
        },
      });

      if (!trip) {
        return null;
      }

      // get any associated images
      const images = await s3Router.createCaller({}).listFiles({ path: `trips/${input.date}/` });

      // find venues with no llmIcon
      const venues = trip.checkins.map((c) => c.venue).filter((v) => !v.llmIcon);
      if (!venues.length) {
        return { ...processTrip(trip), images: images.files };
      }

      // make llm call
      // update venues with llmIcon

      // select trip again
      trip = await prisma.trip.findFirstOrThrow({
        select: tripSelect,
        where: { eqId: trip.eqId },
      });

      return { ...processTrip(trip), images: images.files };
    }),
});

export type AppRouter = typeof tripsRouter;
