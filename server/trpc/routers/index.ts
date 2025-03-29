import { createTRPCRouter } from "~~/server/trpc/init";
import { tripsRouter } from "./trips";

export const appRouter = createTRPCRouter({
  trips: tripsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
