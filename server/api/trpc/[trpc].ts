/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { createNuxtApiHandler } from "trpc-nuxt";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { publicProcedure, router } from "../../trpc/trpc";

export const appRouter = router({
  trips: publicProcedure.query(async () => {
    return prisma.trip.findMany({
      include: {
        checkins: { include: { venue: true }, orderBy: { date: "desc" } },
        flights: { orderBy: { date: "desc" } },
      },
      orderBy: { start: "desc" },
    });
  }),
  trip: publicProcedure
    .input(
      z.object({
        date: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.trip.findFirst({
        include: {
          checkins: { include: { venue: true }, orderBy: { date: "asc" } },
          flights: { orderBy: { date: "asc" } },
        },
        orderBy: { start: "asc" },
        where: {
          start: {
            gte: new Date(input.date as string),
          },
        },
      });
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
