import type { Prisma } from "@prisma/client";
import { createNuxtApiHandler } from "trpc-nuxt";
import { z } from "zod";
import useDev from "~/composables/useDev";
import prisma from "~~/lib/prisma";
import { publicProcedure, router } from "~~/server/trpc/trpc";

// use the same select query for both trips queries
const tripSelect = {
  eqId: true,
  start: true,
  end: true,
  checkins: {
    select: {
      eqId: true,
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
      eqId: true,
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
      eqId: flight.eqId,
      canceled: flight.canceled,
      fromAirport: flight.fromAirport,
      toAirport: flight.toAirport,
      // make a canonical date for display
      date: (flight.actualDeparture || flight.scheduledDeparture || flight.date).toISOString(),
    })),
  };
};

export const appRouter = router({
  // return all trips that have an associated page
  // in dev mode, return all trips
  trips: publicProcedure.query(async () => {
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
  trip: publicProcedure
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

      const trip = await prisma.trip.findFirst({
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

      return processTrip(trip);
    }),
});

export type AppRouter = typeof appRouter;

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
