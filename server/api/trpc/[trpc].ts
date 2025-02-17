import { createNuxtApiHandler } from "trpc-nuxt";
import { z } from "zod";
import useDev from "~/composables/useDev";
import prisma from "~~/lib/prisma";
import { publicProcedure, router } from "~~/server/trpc/trpc";

export const appRouter = router({
  // return all trips that have an associated page
  // in dev mode, return all trips
  trips: publicProcedure.query(async () => {
    let where = {};
    if (!useDev()) {
      const pages = await queryCollection(useEvent(), "trips").select("date").all();
      const pageDates = pages.map((page) => page.date);
      where = {
        OR: pageDates.map((date) => ({
          start: {
            gte: new Date(date + "T00:00:00.000Z"),
            lte: new Date(date + "T23:59:59.999Z"),
          },
        })),
      };
    }

    return prisma.trip.findMany({
      where,
      include: {
        checkins: { include: { venue: true }, orderBy: { date: "desc" } },
        flights: { orderBy: { date: "desc" } },
      },
      orderBy: { start: "desc" },
    });
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
        const page = await queryCollection(useEvent(), "trips").where("date", "=", input.date).first();
        if (!page) {
          return null;
        }
      }

      return prisma.trip.findFirst({
        include: {
          checkins: {
            include: {
              flight: { select: { fromAirport: true, toAirport: true } },
              venue: { include: { restaurant: { select: { award: true, url: true } } } },
            },
            orderBy: { date: "asc" },
          },
          flights: { orderBy: { date: "asc" } },
        },
        orderBy: { start: "asc" },
        where: {
          start: {
            gte: new Date(input.date + "T00:00:00.000Z"),
          },
        },
      });
    }),
});

export type AppRouter = typeof appRouter;

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
