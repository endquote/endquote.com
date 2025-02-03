import { PrismaClient } from "@prisma/client";
import { Trip } from "./trip";
const prisma = new PrismaClient();

export interface TripsResponse {
  data: Trip[];
}

export default defineEventHandler(async (event): Promise<TripsResponse> => {
  try {
    const data = await prisma.trip.findMany({
      include: {
        checkins: { include: { venue: true }, orderBy: { date: "desc" } },
        flights: { orderBy: { date: "desc" } },
      },
      orderBy: { start: "desc" },
    });
    return {
      data: data.map((t) => ({
        ...t,
        start: t.start.toISOString(),
        end: t.end.toISOString(),
      })),
    };
  } catch (error) {
    throw createError(JSON.stringify(error));
  }
});
