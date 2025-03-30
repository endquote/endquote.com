import { createTRPCRouter } from "~~/server/trpc/init";
import { s3Router } from "./s3";
import { tripsRouter } from "./trips";

export const appRouter = createTRPCRouter({
  trips: tripsRouter,
  s3: s3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
